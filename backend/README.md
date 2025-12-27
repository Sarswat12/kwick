# Kwick Backend (Spring Boot)

This folder contains the Spring Boot backend scaffold generated from Spring Initializr and initial configuration to start implementing the APIs described in `docs/`.

Quick notes:

- Project location: `backend/` (artifactId `kwick-backend`)
- Java version: 21 (project configured for Java 21)
- Build: uses the included Maven wrapper (`mvnw.cmd`)
- Port: `5000` (see `src/main/resources/application.properties`)

How to build:

```powershell
cd backend
.\mvnw.cmd -DskipTests package
```

How to run (requires MySQL configured as in `application.properties`):

```powershell
cd backend
.\mvnw.cmd spring-boot:run
# or run the packaged jar
java -jar target/kwick-backend-0.0.1-SNAPSHOT.jar
```

Important files added by the scaffolding and by this setup:

- `src/main/resources/application.properties` — DB, JWT placeholder and CORS allowed origin
- `src/main/java/com/kwick/backend/ApiResponse.java` — API response wrapper used by controllers
- `src/main/java/com/kwick/backend/config/CorsConfig.java` — CORS configuration (reads `cors.allowed.origins`)
- `src/main/java/com/kwick/backend/controller/AuthController.java` — minimal auth endpoints (placeholders)

Next implementation steps (suggested):

1. Implement entities and Spring Data JPA repositories per `docs/DATABASE_SCHEMA.md` and `DATABASE_SCHEMA.sql`.
2. Implement JWT provider, token generation and validation (use `jjwt` or `nimbus-jose-jwt`).
3. Implement Auth service (signup/login/refresh) and integrate with frontend auth flow.
4. Implement KYC endpoints with multipart/form-data and integrate with S3 (or local storage for dev).
5. Add unit/integration tests.

If you'd like, I can now scaffold entities and repository interfaces for the main tables (Users, KYC_VERIFICATION, VEHICLES, RENTALS, PAYMENTS) and implement the JWT provider next.
