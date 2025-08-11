package com.foureyes.moai.backend.domain.schedule.service;

import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.request.EditScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.CreateScheduleResponseDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.EditScheduleResponseDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.GetScheduleListDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.GetScheduleResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleService {
    public CreateScheduleResponseDto registerSchedule(
        Long userId,
        CreateScheduleRequestDto request);
    public EditScheduleResponseDto editSchedule(
        Long userId,
        Long scheduleId,
        EditScheduleRequestDto request);

    GetScheduleResponseDto getSchedule(
        Long userId,
        Long scheduleId);

    List<GetScheduleListDto> listByRange(
        Long userId,
        Long studyId,
        LocalDateTime from,
        LocalDateTime to);

    void deleteSchedule(
        Long userId,
        Long scheduleId);
}
