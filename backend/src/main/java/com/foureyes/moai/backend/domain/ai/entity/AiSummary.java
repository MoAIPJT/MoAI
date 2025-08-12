package com.foureyes.moai.backend.domain.ai.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ai_summaries")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AiSummary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "model_type", length = 100)
    private String modelType;

    @Column(name = "prompt_type", length = 100)
    private String promptType;

    // MySQL JSON 매핑 (Hibernate 6)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "summary_json", columnDefinition = "json")
    private JsonNode summaryJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "summary", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AiSummaryDocument> documents = new ArrayList<>();
}
