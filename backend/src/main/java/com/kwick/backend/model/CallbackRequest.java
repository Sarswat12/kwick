package com.kwick.backend.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.lang.NonNull;

@Entity
public class CallbackRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String name = "";
    @NonNull
    private String email = "";
    @NonNull
    private String phone = "";
    @NonNull
    private String location = "";
    private LocalDateTime createdAt = LocalDateTime.now();

    // Status: "new" or "handled"
    @Column(nullable = false)
    private String status = "new";

    private LocalDateTime handledAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    @NonNull
    public String getName() { return name; }
    public void setName(@NonNull String name) { this.name = name; }
    @NonNull
    public String getEmail() { return email; }
    public void setEmail(@NonNull String email) { this.email = email; }
    @NonNull
    public String getPhone() { return phone; }
    public void setPhone(@NonNull String phone) { this.phone = phone; }
    @NonNull
    public String getLocation() { return location; }
    public void setLocation(@NonNull String location) { this.location = location; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getHandledAt() { return handledAt; }
    public void setHandledAt(LocalDateTime handledAt) { this.handledAt = handledAt; }
}
