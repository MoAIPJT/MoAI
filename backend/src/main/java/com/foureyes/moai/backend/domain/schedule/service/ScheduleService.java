package com.foureyes.moai.backend.domain.schedule.service;

import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.CreateScheduleResponseDto;

public interface ScheduleService {
    public CreateScheduleResponseDto registerSchedule(Long userId, CreateScheduleRequestDto request);
}
