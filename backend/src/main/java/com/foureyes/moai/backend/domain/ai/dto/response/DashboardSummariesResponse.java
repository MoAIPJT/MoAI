package com.foureyes.moai.backend.domain.ai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(name = "DashboardSummariesResponse")
public class DashboardSummariesResponse {
    private List<Item> summaries;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Item {
        private int summaryId;
        private String title;
        private String description;
        private LocalDateTime createdAt;
    }
}
