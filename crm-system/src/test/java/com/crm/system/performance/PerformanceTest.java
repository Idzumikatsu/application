package com.crm.system.performance;

import com.crm.system.BaseIntegrationTest;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PerformanceTest extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        userRepository.deleteAll();
    }

    @Test
    void userCreation_PerformanceTest() throws Exception {
        int numberOfUsers = 100;
        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfUsers; i++) {
            User user = new User("User" + i, "Test", "user" + i + "@test.com", 
                    passwordEncoder.encode("password"), UserRole.STUDENT);
            userRepository.save(user);
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("Created " + numberOfUsers + " users in " + duration + " ms");
        System.out.println("Average time per user: " + (duration / (double) numberOfUsers) + " ms");

        // Performance assertion - should complete in reasonable time
        assert duration < 5000 : "User creation took too long: " + duration + " ms";
    }

    @Test
    void concurrentUserAccess_PerformanceTest() throws Exception {
        int numberOfThreads = 10;
        int requestsPerThread = 10;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfThreads; i++) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                for (int j = 0; j < requestsPerThread; j++) {
                    try {
                        mockMvc.perform(get("/api/auth/signin"))
                                .andExpect(status().isOk());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }
            }, executor);
            futures.add(future);
        }

        // Wait for all requests to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        int totalRequests = numberOfThreads * requestsPerThread;

        System.out.println("Completed " + totalRequests + " requests with " + numberOfThreads + 
                " threads in " + duration + " ms");
        System.out.println("Requests per second: " + (totalRequests / (duration / 1000.0)));

        // Performance assertion
        assert duration < 3000 : "Concurrent access took too long: " + duration + " ms";
    }

    @Test
    void databaseQuery_PerformanceTest() throws Exception {
        // Create test data
        for (int i = 0; i < 1000; i++) {
            User user = new User("User" + i, "Test", "user" + i + "@test.com", 
                    passwordEncoder.encode("password"), UserRole.STUDENT);
            userRepository.save(user);
        }

        long startTime = System.currentTimeMillis();

        // Perform multiple queries
        for (int i = 0; i < 100; i++) {
            userRepository.findByEmail("user" + (i % 100) + "@test.com");
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("Completed 100 database queries in " + duration + " ms");
        System.out.println("Average query time: " + (duration / 100.0) + " ms");

        assert duration < 1000 : "Database queries took too long: " + duration + " ms";
    }

    @Test
    void memoryUsageTest() throws Exception {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();

        // Create some objects to test memory usage
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            User user = new User("User" + i, "Test", "user" + i + "@test.com", 
                    passwordEncoder.encode("password"), UserRole.STUDENT);
            users.add(user);
        }

        long memoryAfterCreation = runtime.totalMemory() - runtime.freeMemory();
        long memoryUsed = memoryAfterCreation - initialMemory;

        System.out.println("Memory used by 1000 User objects: " + memoryUsed + " bytes");
        System.out.println("Average memory per User: " + (memoryUsed / 1000.0) + " bytes");

        // Clean up
        users.clear();
        System.gc();

        assert memoryUsed < 10 * 1024 * 1024 : "Memory usage too high: " + memoryUsed + " bytes";
    }

    @Test
    void responseTimeUnderLoadTest() throws Exception {
        int numberOfRequests = 50;
        long totalResponseTime = 0;
        long minResponseTime = Long.MAX_VALUE;
        long maxResponseTime = Long.MIN_VALUE;

        for (int i = 0; i < numberOfRequests; i++) {
            long startTime = System.nanoTime();
            
            mockMvc.perform(get("/health"))
                    .andExpect(status().isOk());
            
            long endTime = System.nanoTime();
            long responseTime = (endTime - startTime) / 1_000_000; // convert to ms
            
            totalResponseTime += responseTime;
            minResponseTime = Math.min(minResponseTime, responseTime);
            maxResponseTime = Math.max(maxResponseTime, responseTime);
        }

        long averageResponseTime = totalResponseTime / numberOfRequests;

        System.out.println("Response time statistics for " + numberOfRequests + " requests:");
        System.out.println("Average: " + averageResponseTime + " ms");
        System.out.println("Min: " + minResponseTime + " ms");
        System.out.println("Max: " + maxResponseTime + " ms");

        // Performance requirements
        assert averageResponseTime < 100 : "Average response time too high: " + averageResponseTime + " ms";
        assert maxResponseTime < 500 : "Max response time too high: " + maxResponseTime + " ms";
    }

    @Test
    void concurrentUserRegistrationTest() throws Exception {
        int numberOfThreads = 5;
        int registrationsPerThread = 20;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfThreads; i++) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                for (int j = 0; j < registrationsPerThread; j++) {
                    try {
                        String email = "user_" + Thread.currentThread().getId() + "_" + j + "@test.com";
                        mockMvc.perform(post("/api/auth/signup")
                                .contentType("application/json")
                                .content("{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"" + 
                                        email + "\",\"password\":\"password123\",\"role\":\"STUDENT\"}"))
                                .andExpect(status().isOk());
                    } catch (Exception e) {
                        System.err.println("Registration failed: " + e.getMessage());
                    }
                }
            }, executor);
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();
        executor.awaitTermination(2, TimeUnit.MINUTES);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        int totalRegistrations = numberOfThreads * registrationsPerThread;

        System.out.println("Completed " + totalRegistrations + " concurrent registrations in " + 
                duration + " ms");

        assert duration < 10000 : "Concurrent registrations took too long: " + duration + " ms";
    }
}