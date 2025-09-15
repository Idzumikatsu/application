# AOT Compilation and Performance Optimization Guide

This guide explains how to use Ahead-of-Time (AOT) compilation and performance optimization features in the CRM System.

## Lazy Initialization

Lazy initialization is enabled in the following profiles:

### Production Profile (`application-prod.properties`)
```properties
spring.main.lazy-initialization=true
```

### Test Profile (`application-test.properties`) 
```properties
spring.main.lazy-initialization=true
```

### Benefits:
- **Faster startup time**: Beans are created only when needed
- **Reduced memory usage**: Only required beans are loaded initially
- **Better CI/CD performance**: Faster test execution in pipelines

## AOT Compilation Setup

The project is configured for Spring Boot AOT compilation with the following setup:

### Maven Configuration

The `pom.xml` includes:

1. **AOT Processing**: Spring Boot Maven plugin configured with `process-aot` goal
2. **GraalVM Native Image Support**: Native image plugin configuration
3. **Optimized Build Args**: Configuration for Hibernate and Spring initialization

### Usage

#### Enable AOT Processing
```bash
mvn spring-boot:process-aot
```

#### Build Native Image (requires GraalVM)
```bash
mvn -Pnative native:compile
```

## Performance Optimization Features

### 1. Lazy Initialization
Beans are initialized on-demand rather than at application startup.

### 2. Database Connection Pool Optimization
Production and test profiles use optimized connection pool settings:
- Maximum pool size: 5 connections
- Minimum idle: 1 connection  
- Connection timeout: 10 seconds

### 3. JPA Configuration
- DDL auto: create-drop (for testing)
- SQL formatting enabled
- SQL comments enabled for debugging

## CI/CD Integration

### Test Profile Optimization
The test profile (`application-test.properties`) includes:
- Lazy initialization for faster test execution
- In-memory database configuration
- Optimized connection pool settings
- Disabled Telegram bot for testing

### Production Profile Optimization  
The production profile (`application-prod.properties`) includes:
- Lazy initialization for faster startup
- JDBC session storage
- Production database configuration
- Optimized connection pooling

## Monitoring and Metrics

### Actuator Endpoints
The application exposes health and info endpoints:
```properties
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

### Logging Configuration
- DEBUG level for application packages
- SQL logging enabled for development
- Trace-level binding for detailed SQL debugging

## Best Practices

### 1. Use Appropriate Profiles
- **Development**: Use default profile with full logging
- **Testing**: Use test profile with lazy initialization
- **Production**: Use prod profile with optimized settings

### 2. Monitor Performance
- Use Actuator health endpoints
- Monitor startup time with lazy initialization
- Track memory usage improvements

### 3. Gradual Adoption
- Start with lazy initialization in test environment
- Monitor for any bean initialization issues
- Gradually enable in production after testing

## Troubleshooting

### Common Issues

1. **Bean Not Found**: Ensure beans are properly annotated with `@Lazy` if needed
2. **Circular Dependencies**: Lazy initialization can help avoid circular dependency issues
3. **Startup Performance**: Monitor startup time to verify improvements

### Debugging
Enable debug logging to see bean initialization:
```properties
logging.level.org.springframework.beans.factory=DEBUG
```

## Future Enhancements

1. **GraalVM Native Image**: Full native compilation support
2. **Additional AOT Optimizations**: More aggressive AOT processing
3. **Profile-specific Optimizations**: Custom optimizations for different environments

## References

- [Spring Boot AOT Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/aot.html)
- [GraalVM Native Image Guide](https://www.graalvm.org/latest/reference-manual/native-image/)
- [Spring Lazy Initialization](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lazy-init)