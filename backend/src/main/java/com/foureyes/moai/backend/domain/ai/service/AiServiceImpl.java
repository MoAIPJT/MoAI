
package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.CreateAiSummaryRequest;
import com.foureyes.moai.backend.domain.ai.dto.response.CreateAiSummaryResponse;
import com.foureyes.moai.backend.domain.ai.entity.AiSummary;
import com.foureyes.moai.backend.domain.ai.entity.AiSummaryDocument;
import com.foureyes.moai.backend.domain.ai.internal.*;
import com.foureyes.moai.backend.domain.ai.repository.AiSummaryDocumentRepository;
import com.foureyes.moai.backend.domain.ai.repository.AiSummaryRepository;
import com.foureyes.moai.backend.domain.document.entity.Document;
import com.foureyes.moai.backend.domain.document.repository.DocumentRepository;
import com.foureyes.moai.backend.domain.document.service.DocumentService;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final AiSummaryRepository aiSummaryRepository;
    private final AiSummaryDocumentRepository aiSummaryDocumentRepository;

    private final DocumentService documentService;
    private final StorageService storageService;

    // 역할별 컴포넌트
    private final PdfTextExtractor pdfTextExtractor;
    private final PromptBuilder promptBuilder;
    private final ModelResolver modelResolver;
    private final GeminiApiClient geminiApiClient;
    private final SummaryParser summaryParser;
    private final ObjectMapper objectMapper;

    @Override
    public CreateAiSummaryResponse createSummary(int ownerId, CreateAiSummaryRequest req) {
        if (req.getFileId() == null || req.getFileId().isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 문서 검증
        List<Integer> docIds = req.getFileId().stream()
            .filter(Objects::nonNull).distinct().toList();
        List<Document> docs = documentRepository.findAllById(docIds);
        if (docs.size() != docIds.size()) throw new CustomException(ErrorCode.DOCUMENT_NOT_FOUND);

        try {
            // 1) 문서 텍스트 → DOC 블록
            List<String> docBlocks = new ArrayList<>(docs.size());
            for (Document d : docs) {
                String key = documentService.getDocumentKeyIfAllowed(ownerId, d.getId());
                try (InputStream in = storageService.openDocumentStream(key)) {
                    String text = pdfTextExtractor.extractTextWithPages(in, Optional.ofNullable(d.getTitle()).orElse("document-" + d.getId()));
                    String clipped = promptBuilder.clip(text, 12000);
                    docBlocks.add(promptBuilder.formatDocBlock(d.getId(), d.getTitle(), clipped));
                }
            }
            String joinedBlocks = String.join("\n\n", docBlocks);

            // 2) 프롬프트 생성(사용자 프롬프트 병합)
            String prompt = promptBuilder.buildMultiDocPrompt(joinedBlocks, req.getPromptType());

            // 3) 모델 선택 → API URL 구성 → 호출
            String model = modelResolver.resolveModel(req.getModelType());
            String apiUrl = modelResolver.buildApiUrl(model);
            String summaryJson = geminiApiClient.generateContent(apiUrl, prompt).block();

            // 4) JSON 파싱 검증
            List<SummaryDto> parsed = summaryParser.parse(summaryJson);
            log.info("AI 요약 파싱 결과: {} items", parsed.size());

            // 5) 요약 저장
            AiSummary summary = AiSummary.builder()
                .owner(owner)
                .title(Optional.ofNullable(req.getTitle()).orElse("").trim())
                .description(Optional.ofNullable(req.getDescription()).orElse("").trim())
                .modelType(model)
                .promptType(Optional.ofNullable(req.getPromptType()).orElse("").trim())
                .summaryJson(objectMapper.readTree(summaryJson))
                .build();
            aiSummaryRepository.save(summary);

            // 6) 링크 저장
            for (Document d : docs) {
                if (!aiSummaryDocumentRepository.existsBySummary_IdAndDocument_Id(summary.getId(), d.getId())) {
                    aiSummaryDocumentRepository.save(
                        AiSummaryDocument.builder().summary(summary).document(d).build()
                    );
                }
            }

            return CreateAiSummaryResponse.builder()
                .summary_id(summary.getId())
                .title(summary.getTitle())
                .description(summary.getDescription())
                .model_type(summary.getModelType())
                .prompt_type(summary.getPromptType())
                .build();

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI 요약 생성 실패", e);
            throw new RuntimeException("AI 요약 생성에 실패했습니다.", e);
        }
    }
}
