package com.foureyes.moai.backend.domain.ai.entity;

import com.foureyes.moai.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "ai_summaries")
@Entity
@Getter
@NoArgsConstructor
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    private String description;

    private String modelType;

    private String promptType;

    @Builder
    public Summary(User user, String title, String description, String modelType, String promptType) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.modelType = modelType;
        this.promptType = promptType;
    }

    public void updateSummary(String title, String description) {
        this.title = title;
        this.description = description;
    }
}
