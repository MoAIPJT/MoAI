FROM eclipse-temurin:21 AS builder

ENV TZ=Asia/Seoul \
    SPRING_PROFILES_ACTIVE=docker

WORKDIR /.

# Copy only the pom.xml first to leverage Docker cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw ./
RUN chmod +x ./mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:resolve

# Copy the rest of the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Final stage
FROM eclipse-temurin:21

ENV TZ=Asia/Seoul \
    SPRING_PROFILES_ACTIVE=docker

WORKDIR /.

# Copy only the jar file from the builder stage
COPY --from=builder /target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
