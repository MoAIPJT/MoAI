package com.foureyes.moai.backend.domain.document.service;

import com.foureyes.moai.backend.domain.document.dto.request.CreateDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.request.EditDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentListItemDto;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

public interface DocumentService {
    DocumentResponseDto uploadDocument(int uploaderId, CreateDocumentRequest req) throws IOException;
    String getDocumentKeyIfAllowed(int userId, int documentId);
    void updateDocument(int userId, int documentId, EditDocumentRequest req);
    List<DocumentListItemDto> getDocuments(int userId, int studyId);
    void deleteDocument(int userId, int documentId);

}
