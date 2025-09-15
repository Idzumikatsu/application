FROM openjdk:17-jre-slim
WORKDIR /app
COPY target/email-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]