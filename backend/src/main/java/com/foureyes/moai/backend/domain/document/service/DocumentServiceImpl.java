package com.foureyes.moai.backend.domain.document.service;

import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.document.dto.request.CreateDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.request.EditDocumentRequest;
import com.foureyes.moai.backend.domain.document.dto.response.DocumentResponseDto;
import com.foureyes.moai.backend.domain.document.entity.Category;
import com.foureyes.moai.backend.domain.document.entity.Document;
import com.foureyes.moai.backend.domain.document.entity.DocumentCategory;
import com.foureyes.moai.backend.domain.document.repository.CategoryRepository;
import com.foureyes.moai.backend.domain.document.repository.DocumentCategoryRepository;
import com.foureyes.moai.backend.domain.document.repository.DocumentRepository;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService{
    private final CategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;
    private final DocumentCategoryRepository documentCategoryRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final StudyMembershipRepository studyMembershipRepository;
    @Override
    @Transactional
    public DocumentResponseDto uploadDocument(int uploaderId, CreateDocumentRequest req) throws IOException, IOException {
        // 1) 기본 검증
        if (req.getFile() == null || req.getFile().isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }
        if (!StringUtils.hasText(req.getTitle())) {
            throw new IllegalArgumentException("제목은 필수입니다.");
        }

        // 2) 카테고리 조회 (스터디 식별)
        Category category = categoryRepository.findById(req.getCategoryId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));
        StudyGroup study = category.getStudyGroup();

        // 3) 스토리지 업로드 (PDF만 허용 / 비공개 버킷 / key 반환)
        //    StorageService에서 contentType 검사(application/pdf) 및 예외 처리
        String storedKey = storageService.uploadDocument(req.getFile(), study.getId());

        // 4) 문서 저장
        Document doc = Document.builder()
            .studyGroup(study)
            .uploader(userRepository.getReferenceById(uploaderId))
            .title(req.getTitle())
            .description(req.getDescription())
            .fileKey(storedKey) // URL이 아닌 key 저장
            .build();
        Document saved = documentRepository.save(doc);

        // 5) 문서-카테고리 매핑 (Unique(document, category) 가정)
        if (!documentCategoryRepository.existsByDocument_IdAndCategory_Id(saved.getId(), category.getId())) {
            documentCategoryRepository.save(
                DocumentCategory.builder()
                    .document(saved)
                    .category(category)
                    .build()
            );
        }

        // 6) 응답
        return DocumentResponseDto.builder()
            .id(saved.getId())
            .studyId(study.getId())
            .title(saved.getTitle())
            .description(saved.getDescription())
            .fileKey(saved.getFileKey()) // key 그대로 반환
            .categoryIds(List.of(category.getId()))
            .createdAt(LocalDateTime.now()) // DB default 사용하는 경우 간단 대체
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public String getDocumentKeyIfAllowed(int userId, int documentId) {
        Document doc = documentRepository.findById(documentId)
            .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND));

        boolean hasAccess = studyMembershipRepository.existsByUserIdAndStudyGroup_IdAndStatus(
            userId, doc.getStudyGroup().getId(), StudyMembership.Status.APPROVED);

        if (!hasAccess) throw new CustomException(ErrorCode.FORBIDDEN_DOCUMENT_ACCESS);
        return doc.getFileKey(); // DB 컬럼 file_key
    }

    @Override
    @Transactional
    public void updateDocument(int userId, int documentId, EditDocumentRequest req) {
        Document doc = documentRepository.findById(documentId)
            .orElseThrow(() -> new CustomException(ErrorCode.DOCUMENT_NOT_FOUND));

        // 권한 체크(예시: 승인 멤버)
        boolean allowed = studyMembershipRepository.existsByUserIdAndStudyGroup_IdAndStatus(
            userId, doc.getStudyGroup().getId(), StudyMembership.Status.APPROVED);
        if (!allowed) throw new CustomException(ErrorCode.FORBIDDEN_DOCUMENT_ACCESS);

        // 제목/설명
        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            doc.setTitle(req.getTitle().trim());
        }
        if (req.getDescription() != null) {
            doc.setDescription(req.getDescription().trim());
        }


        // 카테고리 갱신(요청이 null이면 스킵, 빈 리스트면 모두 해제)
        if (req.getCategoryIdList() != null) {

            List<Category> categories = req.getCategoryIdList().isEmpty()
                ? List.of()
                : categoryRepository.findAllById(req.getCategoryIdList());

            if (categories.size() != req.getCategoryIdList().size()) {
                throw new CustomException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            boolean allSameStudy = categories.stream()
                .allMatch(c -> c.getStudyGroup().getId() == doc.getStudyGroup().getId());
            if (!allSameStudy) throw new CustomException(ErrorCode.INVALID_REQUEST);

            // 기존 링크 삭제 후 신규 삽입
            documentCategoryRepository.deleteByDocument_Id(doc.getId());
            documentCategoryRepository.flush();

            if (!categories.isEmpty()) {
                List<DocumentCategory> links = new ArrayList<>(categories.size());
                for (Category c : categories) {
                    links.add(DocumentCategory.builder()
                        .document(doc)
                        .category(c)
                        .build());
                }
                documentCategoryRepository.saveAll(links);
            }
        }
    }
}
