package com.foureyes.moai.backend.domain.ai.internal;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SummaryParser {

    private final ObjectMapper objectMapper;

    /** JSON → List<SummaryDto> */
    public List<SummaryDto> parse(String jsonResponse) {
        try {
            List<SummaryDto> list = objectMapper.readValue(jsonResponse, new TypeReference<>() {});
            log.info("AI 응답 파싱 완료 ({} items)", list.size());
            return list;
        } catch (Exception e) {
            log.error("AI 응답 JSON 파싱 실패: {}", jsonResponse, e);
            throw new RuntimeException("AI 응답 파싱에 실패했습니다.", e);
        }
    }
}
