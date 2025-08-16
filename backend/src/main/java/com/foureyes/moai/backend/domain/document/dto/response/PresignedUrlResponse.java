package com.foureyes.moai.backend.domain.document.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PresignedUrlResponse {
    private String PresignedUrl;
}
