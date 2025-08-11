package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.CreateAiSummaryRequest;
import com.foureyes.moai.backend.domain.ai.dto.response.CreateAiSummaryResponse;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


public interface AiService {
    /**
     * 입력: MultipartFile
     * 출력: List<SummaryDto>
     * 기능: PDF 파일을 요약한다.
     */
    //List<SummaryDto> summarizePdf(InputStream pdfInputStream, String fileName) throws IOException;
    //private String extractTextFromPdf(InputStream inputStream, String fileName) throws IOException;
    /**
     * 입력: MultipartFile
     * 출력: String
     * 기능: PDF 파일에서 텍스트를 추출한다.
     */


    CreateAiSummaryResponse createSummary(int ownerId, CreateAiSummaryRequest req);
}
