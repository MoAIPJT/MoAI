// domain/study/session/entity/StudySession.java
package com.foureyes.moai.backend.domain.study.session.entity;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "study_sessions")
@NoArgsConstructor @AllArgsConstructor @Builder
public class StudySession {

    public enum Platform { LIVEKIT, OPENVIDU }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    @Column(name = "room_name", nullable = false, length = 128)
    private String roomName;

    @Column(name = "created_by", nullable = false)
    private Long createdBy; // userId

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    public boolean isOpen() { return closedAt == null; }
}
