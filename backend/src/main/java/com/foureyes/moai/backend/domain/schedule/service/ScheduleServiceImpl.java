package com.foureyes.moai.backend.domain.schedule.service;

import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.request.EditScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.*;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    // SLF4J Logger snippet 적용
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ScheduleServiceImpl.class);

    private final ScheduleRepository scheduleRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;
    private final StudyMembershipRepository studyMembershipRepository;

    /**
     * 입력: int userId, CreateScheduleRequestDto request
     * 출력: CreateScheduleResponseDto
     * 기능: 새로운 일정을 생성합니다.
     */
    @Override
    @Transactional
    public CreateScheduleResponseDto registerSchedule(int userId, CreateScheduleRequestDto request) {
        log.info("일정 등록 시작: userId={}, studyId={}", userId, request.getStudyId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("사용자를 찾을 수 없음: userId={}", userId);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        StudyGroup studyGroup = studyGroupRepository.findById(request.getStudyId())
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

    /**
     * 입력: int userId, int scheduleId, EditScheduleRequestDto request
     * 출력: EditScheduleResponseDto
     * 기능: 기존 일정을 부분 수정합니다.
     */
    @Override
    @Transactional
    public EditScheduleResponseDto editSchedule(int userId, int scheduleId, EditScheduleRequestDto request) {
        log.info("일정 수정 시작: userId={}, scheduleId={}", userId, scheduleId);

        if (request.hasNoChanges()) {
            log.warn("수정할 필드가 없음");
            throw new CustomException(ErrorCode.BAD_REQUEST); // 프로젝트의 공통 에러코드 사용
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new CustomException(ErrorCode.SCHEDULE_NOT_FOUND));

        // 권한: 작성자 본인만
        if (!(schedule.getUser().getId() == user.getId())) {
            log.warn("수정 권한 없음: requester={}, owner={}", user.getId(), schedule.getUser().getId());
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 시간 유효성: 단일 필드만 바뀌는 경우도 고려해서 현재값과 교차 검증
        LocalDateTime newStart = request.getStartDatetime() != null ? request.getStartDatetime() : schedule.getStartDatetime();
        LocalDateTime newEnd   = request.getEndDatetime()   != null ? request.getEndDatetime()   : schedule.getEndDatetime();
        if (newStart.isAfter(newEnd)) {
            throw new CustomException(ErrorCode.INVALID_DATETIME);
        }

        if (request.getStartDatetime() != null) schedule.setStartDatetime(request.getStartDatetime());
        if (request.getEndDatetime()   != null) schedule.setEndDatetime(request.getEndDatetime());
        if (request.getTitle()         != null) schedule.setTitle(request.getTitle());
        if (request.getMemo()          != null) schedule.setMemo(request.getMemo());

        Schedule updated = scheduleRepository.save(schedule);
        log.info("일정 수정 완료: scheduleId={}", updated.getId());
        return EditScheduleResponseDto.from(updated);
    }

    /**
     * 입력: int userId, int scheduleId
     * 출력: GetScheduleResponseDto
     * 기능: 일정 단건 조회
     */
    @Override
    @Transactional(readOnly = true)
    public GetScheduleResponseDto getSchedule(int userId, int scheduleId) {
        log.info("일정 단건 조회 시작: userId={}, scheduleId={}", userId, scheduleId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> {
                log.warn("일정을 찾을 수 없음: scheduleId={}", scheduleId);
                return new CustomException(ErrorCode.SCHEDULE_NOT_FOUND);
            });

        // 스터디 멤버만 조회 가능
        boolean isMember = studyMembershipRepository.existsByUserIdAndStudyGroup_Id(
            userId, schedule.getStudyGroup().getId());

        if (!isMember) {
            log.warn("스터디 멤버가 아님: userId={}, studyId={}", userId, schedule.getStudyGroup().getId());
            throw new CustomException(ErrorCode.STUDY_NOT_MEMBER); // 혹은 FORBIDDEN
        }

        log.info("일정 단건 조회 완료: scheduleId={}", scheduleId);
        return GetScheduleResponseDto.from(schedule);
    }

    /**
     * 입력: int userId, int studyId, LocalDateTime from, LocalDateTime to
     * 출력: List<GetScheduleListDto>
     * 기능: 스터디 기간 내 일정 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<GetScheduleListDto> listByRange(int userId, int studyId,
                                                LocalDateTime from, LocalDateTime to) {
        log.info("일정 기간 조회 시작: userId={}, studyId={}, from={}, to={}",
            userId, studyId, from, to);

        if (from == null || to == null || !from.isBefore(to)) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        // 오남용 방지(약 3개월 제한)
        if (Duration.between(from, to).toDays() > 93) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        // 스터디 멤버만 조회 가능
        boolean isMember = studyMembershipRepository
            .existsByUserIdAndStudyGroup_Id(userId, studyId);
        if (!isMember) {
            log.warn("스터디 멤버가 아님: userId={}, studyId={}", userId, studyId);
            throw new CustomException(ErrorCode.STUDY_NOT_MEMBER);
        }

        // 겹치는 일정 조회: start < to AND end > from
        List<Schedule> list = scheduleRepository.findOverlappingByStudy(
            studyId, from, to);

        log.info("일정 기간 조회 완료: count={}", list.size());
        return list.stream().map(GetScheduleListDto::from).toList();
    }

    /**
     * 입력: int userId, LocalDateTime from, LocalDateTime to
     * 출력: List<MyScheduleListDto>
     * 기능: 마이페이지 일정 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyScheduleListDto> listMySchedules(int userId, LocalDateTime from, LocalDateTime to) {
        if (from == null || to == null || !from.isBefore(to)) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        if (Duration.between(from, to).toDays() > 93) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        List<Schedule> list = scheduleRepository.findMyOverlapping(
            userId, StudyMembership.Status.APPROVED, from, to);

        return list.stream().map(MyScheduleListDto::from).toList();
    }

    /**
     * 입력: int userId, int scheduleId
     * 출력: void
     * 기능: 일정 삭제
     */
    @Override
    @Transactional
    public void deleteSchedule(int userId, int scheduleId) {
        log.info("일정 삭제 시작: userId={}, scheduleId={}", userId, scheduleId);

        // 1) 일정 존재 확인
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> {
                log.warn("일정을 찾을 수 없음: scheduleId={}", scheduleId);
                return new CustomException(ErrorCode.SCHEDULE_NOT_FOUND);
            });

        int studyId = schedule.getStudyGroup().getId();

        // 2) 승인(APPROVED) 멤버십 조회 (role 확인을 위해 엔티티로 조회)
        StudyMembership membership = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                userId,
                studyId,
                StudyMembership.Status.APPROVED
            )
            .orElseGet(() -> {
                // 승인 멤버십이 없다면: 멤버인지 자체를 확인해서 에러를 구분
                boolean isMemberAnyStatus = studyMembershipRepository
                    .existsByUserIdAndStudyGroup_Id(userId, studyId);
                if (isMemberAnyStatus) {
                    log.warn("승인되지 않은 멤버 상태: userId={}, studyId={}", userId, studyId);
                    throw new CustomException(ErrorCode.FORBIDDEN); // 미승인/탈퇴/거절 등
                } else {
                    log.warn("스터디 멤버가 아님: userId={}, studyId={}", userId, studyId);
                    throw new CustomException(ErrorCode.STUDY_NOT_MEMBER);
                }
            });

        // 3) 역할 체크: ADMIN 또는 DELEGATE만 삭제 가능
        StudyMembership.Role role = membership.getRole();
        boolean canManage = (role == StudyMembership.Role.ADMIN || role == StudyMembership.Role.DELEGATE);
        if (!canManage) {
            log.warn("삭제 권한 없음: userId={}, studyId={}, role={}", userId, studyId, role);
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 4) 삭제 수행
        scheduleRepository.delete(schedule);
        log.info("일정 삭제 완료: scheduleId={}", scheduleId);
    }


}
