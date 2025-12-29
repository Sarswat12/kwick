# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jre

# Set the working directory
WORKDIR /app

# Copy the built jar file from your repo to the container
COPY target/kwick-backend-0.0.1-SNAPSHOT.jar.original app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
