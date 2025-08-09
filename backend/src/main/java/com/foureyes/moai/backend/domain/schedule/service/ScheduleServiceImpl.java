package com.foureyes.moai.backend.domain.schedule.service;

import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.CreateScheduleResponseDto;
import com.foureyes.moai.backend.domain.schedule.entity.Schedule;
import com.foureyes.moai.backend.domain.schedule.repository.ScheduleRepository;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleServiceImpl.class);

    private final ScheduleRepository scheduleRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;
    private final StudyMembershipRepository studyMembershipRepository;

    /**
     * 입력: Long userId (사용자 ID), CreateScheduleRequestDto request (일정 생성 정보)
     * 출력: CreateScheduleResponseDto (생성된 일정 정보)
     * 기능: 새로운 일정을 생성합니다.
     */
    @Override
    @Transactional
    public CreateScheduleResponseDto registerSchedule(Long userId, CreateScheduleRequestDto request) {
        log.info("일정 등록 시작: userId={}, studyId={}", userId, request.getStudyId());

        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> {
                    log.warn("사용자를 찾을 수 없음: userId={}", userId);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        StudyGroup studyGroup = studyGroupRepository.findById(request.getStudyId().intValue())
                .orElseThrow(() -> {
                    log.warn("스터디 그룹을 찾을 수 없음: studyId={}", request.getStudyId());
                    return new CustomException(ErrorCode.STUDY_GROUP_NOT_FOUND);
                });

        boolean isMember = studyMembershipRepository.
            existsByUserIdAndStudyGroup_Id(user.getId(), studyGroup.getId());


        if (!isMember) {
            log.warn("스터디 멤버가 아님: userId={}, studyId={}", userId, request.getStudyId());
            throw new CustomException(ErrorCode.STUDY_NOT_MEMBER);
        }

        if (request.getStartDatetime().isAfter(request.getEndDatetime())) {
            log.warn("시작 시간이 종료 시간보다 늦음: startTime={}, endTime={}",
                request.getStartDatetime(), request.getEndDatetime());
            throw new CustomException(ErrorCode.INVALID_DATETIME);
        }

        Schedule schedule = Schedule.builder()
                .studyGroup(studyGroup)
                .user(user)
                .startDatetime(request.getStartDatetime())
                .endDatetime(request.getEndDatetime())
                .title(request.getTitle())
                .memo(request.getMemo())
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        log.info("일정 등록 완료: scheduleId={}", savedSchedule.getId());

        return CreateScheduleResponseDto.from(savedSchedule);
    }
}
