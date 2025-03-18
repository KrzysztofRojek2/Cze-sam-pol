package com.example.store.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ErrorReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String userId;
    private String status;  // np. "NEW", "IN_PROGRESS", "RESOLVED"

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;
    @Lob
    private byte[] image;

    public ErrorReport(String description, String userId, byte[] image) {
        this.description = description;
        this.userId = userId;
        this.status = "NEW";
        this.createdAt = LocalDateTime.now();
        this.image = image;
    }
}
