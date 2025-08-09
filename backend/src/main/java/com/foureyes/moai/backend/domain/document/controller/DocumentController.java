package com.foureyes.moai.backend.domain.document.controller;


import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.document.dto.request.CreateDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentResponseDto;
import com.foureyes.moai.backend.domain.document.dto.response.PresignedUrlResponse;
import com.foureyes.moai.backend.domain.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;

@Tag(name = "docs API", description = "공부 자료 관리 기능")
@RestController
@RequestMapping("/ref")
@RequiredArgsConstructor
public class DocumentController {
    private final JwtTokenProvider jwtTokenProvider;
    private final DocumentService documentService;
    private final StorageService storageService;

    private int extractUserIdFromToken(String bearerToken) {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        return jwtTokenProvider.getUserId(token);
    }

    @Operation(
        summary = "공부 자료 업로드",
        description = "PDF를 비공개 버킷에 업로드하고 key를 저장합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponseDto> upload(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @ModelAttribute @Valid CreateDocumentRequest request
    ) throws IOException {
        int userId = extractUserIdFromToken(bearerToken);
        DocumentResponseDto dto = documentService.uploadDocument(userId, request);
        return ResponseEntity.status(201).body(dto);
    }

    @Operation(
        summary = "단일 문서 다운로드 URL 발급",
        description = "문서 접근 권한 확인 후 Pre-signed URL을 발급합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/download-url/{id}")
    public ResponseEntity<PresignedUrlResponse> getDownloadUrl(
        @RequestHeader("Authorization") String bearerToken,
        @PathVariable int id
    ) {
        int userId = extractUserIdFromToken(bearerToken);
        String key = documentService.getDocumentKeyIfAllowed(userId, id);
        String url = storageService.presignDocumentDownloadUrl(key, Duration.ofMinutes(10));

        return ResponseEntity.ok(new PresignedUrlResponse(url));
    }

}

