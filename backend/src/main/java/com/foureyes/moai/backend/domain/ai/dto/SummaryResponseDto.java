package com.foureyes.moai.backend.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class SummaryResponseDto {
    private String filename;
    private List<SummaryDto> summary;
}
