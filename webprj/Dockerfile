# Stage 1: Build the application with Gradle and Corretto JDK 21
FROM gradle:jdk21-corretto AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các tệp mã nguồn vào container
COPY . .

# Chạy gradle clean build mà không chạy test
RUN gradle clean build -x test

# Stage 2: Chạy ứng dụng với OpenJDK 21 hoặc Corretto JDK 21
FROM openjdk:21-jdk-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file JAR đã build từ stage 1 vào container
COPY --from=build /app/build/libs/*.jar app.jar


# Mở cổng 8080 để có thể truy cập ứng dụng
EXPOSE 8080

# Chạy ứng dụng Spring Boot sau khi MySQL sẵn sàng
ENTRYPOINT ["java", "-jar", "app.jar"]
