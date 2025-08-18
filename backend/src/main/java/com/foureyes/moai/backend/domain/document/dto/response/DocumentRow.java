package com.foureyes.moai.backend.domain.document.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DocumentRow {
    private int id;
    private String title;
    private String description;
    private String profileImageUrl; // User.profileImageUrl
    private String name;            // User.name
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
