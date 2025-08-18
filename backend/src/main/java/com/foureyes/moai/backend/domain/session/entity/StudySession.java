// domain/study/session/entity/StudySession.java
package com.foureyes.moai.backend.domain.session.entity;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "study_sessions")
@NoArgsConstructor @AllArgsConstructor @Builder
public class StudySession {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @Column(name = "room_name", nullable = false, length = 128)
    private String roomName;

    @Column(name = "created_by", nullable = false)
    private int createdBy; // userId

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    public boolean isOpen() { return closedAt == null; }
}
