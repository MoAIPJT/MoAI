package com.foureyes.moai.backend.domain.document.controller;


import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.document.dto.request.CreateDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentResponseDto;
import com.foureyes.moai.backend.domain.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Tag(name = "docs API", description = "공부 자료 관리 기능")
@RestController
@RequestMapping("/ref")
@RequiredArgsConstructor
public class DocumentController {
    private final JwtTokenProvider jwtTokenProvider;
    private final DocumentService documentService;

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
        @RequestHeader("Authorization") String bearerToken,
        @ModelAttribute @Valid CreateDocumentRequest request
    ) throws IOException {
        int userId = extractUserIdFromToken(bearerToken);
        DocumentResponseDto dto = documentService.uploadDocument(userId, request);
        return ResponseEntity.status(201).body(dto);
    }

}

