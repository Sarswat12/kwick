package com.kwick.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "RENTALS")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long vehicleId;
    private Instant startTime;
    private Instant endTime;
    private String status = "active";

    // getters/setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public void setStartDate(LocalDateTime dt) {
        if (dt == null)
            return;
        this.startTime = dt.atZone(ZoneId.systemDefault()).toInstant();
    }

    public void setEndDate(LocalDateTime dt) {
        if (dt == null)
            return;
        this.endTime = dt.atZone(ZoneId.systemDefault()).toInstant();
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
