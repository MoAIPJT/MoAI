package com.foureyes.moai.backend.domain.document.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_categories") // 테이블명이 snake_case라서 이름만 매핑
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"document", "category"})
public class DocumentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // INT AUTO_INCREMENT

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false) // FK는 DB에서 이미 존재
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
