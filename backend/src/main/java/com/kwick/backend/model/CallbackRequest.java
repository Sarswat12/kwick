package com.kwick.backend.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;




@Entity
@Table(name = "callback_request")
public class CallbackRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name = "";
    @Column(nullable = false, length = 100)
    private String email = "";
    @Column(nullable = false, length = 20)
    private String phone = "";
    @Column(nullable = false, length = 100)
    private String location = "";
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Status: "new" or "handled"
    @Column(nullable = false, length = 20)
    private String status = "new";

    @Column(name = "handled_at")
    private LocalDateTime handledAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name == null ? "" : name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email == null ? "" : email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone == null ? "" : phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location == null ? "" : location; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getHandledAt() { return handledAt; }
    public void setHandledAt(LocalDateTime handledAt) { this.handledAt = handledAt; }
}
