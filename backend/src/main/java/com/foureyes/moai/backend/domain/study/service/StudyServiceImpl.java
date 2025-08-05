package com.foureyes.moai.backend.domain.study.service;

import com.foureyes.moai.backend.commons.util.FileUploadUtil;
import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final StudyGroupRepository studyGroupRepository;

    @Override
    public StudyResponseDto createStudy(int userId, CreateStudyRequest request) {
        //현재는 태스트 Url 들어감
        String imageUrl =  FileUploadUtil.uploadImage(request.getImage());
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
