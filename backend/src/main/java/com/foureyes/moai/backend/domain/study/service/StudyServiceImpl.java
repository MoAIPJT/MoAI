package com.foureyes.moai.backend.domain.study.service;

import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final StudyGroupRepository studyGroupRepository;
    private final StorageService storageService;

    @Override
    public StudyResponseDto createStudy(int userId, CreateStudyRequest request) {
        //현재는 태스트 Url 들어감
        String imageUrl = "까비";
        try {
            imageUrl = storageService.uploadFile(request.getImage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        StudyGroup studyGroup = StudyGroup.builder()
            .name(request.getName())
            .description(request.getDescription())
            .imageUrl(imageUrl)
            .createdBy(userId)
            .createdAt(LocalDateTime.now())
            .build();

        studyGroupRepository.save(studyGroup);

        return StudyResponseDto.builder()
            .id(studyGroup.getId())
            .name(studyGroup.getName())
            .description(studyGroup.getDescription())
            .imageUrl(studyGroup.getImageUrl())
            .createdBy(studyGroup.getCreatedBy())
            .createdAt(studyGroup.getCreatedAt())
            .build();
    }
}
