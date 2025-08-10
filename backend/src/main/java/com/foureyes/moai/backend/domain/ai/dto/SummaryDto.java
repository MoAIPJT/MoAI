package com.foureyes.moai.backend.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SummaryDto {
    @JsonProperty("summary_sentence")
    private String summarySentence;

    @JsonProperty("orginal_quote")
    private String orginalQuote;

    @JsonProperty("page_number")
    private String pageNumber;
}
