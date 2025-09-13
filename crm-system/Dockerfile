# Многоступенчатая сборка для оптимизации размера образа

# Этап сборки
FROM maven:3-openjdk-17-slim AS build

WORKDIR /app

# Копируем pom.xml для загрузки зависимостей
COPY pom.xml .

# Копируем исходный код
COPY src ./src

# Собираем приложение без запуска тестов
RUN mvn clean package -DskipTests

# Этап runtime
FROM openjdk:17-slim

WORKDIR /app

# Устанавливаем curl для healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Копируем JAR файл из этапа сборки
COPY --from=build /app/target/*.jar app.jar

# Экспонируем порт 8080
EXPOSE 8080

# Команда запуска приложения
CMD ["java", "-jar", "app.jar"]