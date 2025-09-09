package com.crm.system.service;

import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("John", "Doe", "john.doe@example.com", "encodedPassword", UserRole.TEACHER);
        testUser.setId(1L);
    }

    @Test
    void findByEmail_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findByEmail("john.doe@example.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    void findByEmail_WhenUserNotExists_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.findByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void createUser_ShouldEncodePasswordAndSaveUser() {
        // Arrange
        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUser("John", "Doe", "john.doe@example.com", "plainPassword", UserRole.TEACHER);

        // Assert
        assertNotNull(result);
        assertEquals("encodedPassword", result.getPassword());
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void findByRole_ShouldReturnUsersWithSpecifiedRole() {
        // Arrange
        List<User> teachers = Arrays.asList(testUser);
        when(userRepository.findByRoleAndIsActive(UserRole.TEACHER, true)).thenReturn(teachers);

        // Act
        List<User> result = userService.findByRole(UserRole.TEACHER);

        // Assert
        assertEquals(1, result.size());
        assertEquals(testUser, result.get(0));
        verify(userRepository, times(1)).findByRoleAndIsActive(UserRole.TEACHER, true);
    }

    @Test
    void findById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void updateUser_ShouldSaveUpdatedUser() {
        // Arrange
        User updatedUser = new User("John", "Updated", "john.updated@example.com", "newPassword", UserRole.TEACHER);
        updatedUser.setId(1L);
        when(userRepository.save(updatedUser)).thenReturn(updatedUser);

        // Act
        User result = userService.updateUser(updatedUser);

        // Assert
        assertNotNull(result);
        assertEquals("Updated", result.getLastName());
        verify(userRepository, times(1)).save(updatedUser);
    }

    @Test
    void deleteUser_ShouldCallRepositoryDelete() {
        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void existsByEmail_WhenEmailExists_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(true);

        // Act
        Boolean result = userService.existsByEmail("john.doe@example.com");

        // Assert
        assertTrue(result);
        verify(userRepository, times(1)).existsByEmail("john.doe@example.com");
    }

    @Test
    void existsByEmail_WhenEmailNotExists_ShouldReturnFalse() {
        // Arrange
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        // Act
        Boolean result = userService.existsByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result);
        verify(userRepository, times(1)).existsByEmail("nonexistent@example.com");
    }
}