package com.foureyes.moai.backend.domain.study.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "study_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_by")
    private int createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "hash_id", nullable = false, unique = true, length = 100)
    private String hashId;

    @Column(columnDefinition = "TEXT")
    private String notice;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyMembership> memberships = new ArrayList<>();

}
