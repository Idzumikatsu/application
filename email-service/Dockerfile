FROM openjdk:17-jdk-alpine as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/email-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]