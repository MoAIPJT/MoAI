package com.foureyes.moai.backend.domain.ai.entity;
import com.foureyes.moai.backend.domain.document.entity.Document;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "ai_summary_documents",
    uniqueConstraints = @UniqueConstraint(name = "uq_summary_doc", columnNames = {"summary_id","document_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSummaryDocument {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "summary_id", nullable = false)
    private AiSummary summary;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;
}
