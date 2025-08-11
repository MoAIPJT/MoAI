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
        int userId,
        CreateScheduleRequestDto request);
    public EditScheduleResponseDto editSchedule(
        int userId,
        int scheduleId,
        EditScheduleRequestDto request);

    GetScheduleResponseDto getSchedule(
        int userId,
        int scheduleId);

    List<GetScheduleListDto> listByRange(
        int userId,
        int studyId,
        LocalDateTime from,
        LocalDateTime to);

    void deleteSchedule(
        int userId,
        int scheduleId);
}
