package com.foureyes.moai.backend.domain.document.service;

import com.foureyes.moai.backend.domain.document.dto.request.CreateDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentResponseDto;

import java.io.IOException;

public interface DocumentService {
    DocumentResponseDto uploadDocument(int uploaderId, CreateDocumentRequest req) throws IOException;
    String getDocumentKeyIfAllowed(int userId, int documentId);
}
