package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.CreateAiSummaryRequest;
import com.foureyes.moai.backend.domain.ai.dto.request.EditAiSummaryRequest;
import com.foureyes.moai.backend.domain.ai.dto.response.CreateAiSummaryResponse;
import com.foureyes.moai.backend.domain.ai.dto.response.DashboardSummariesResponse;
import com.foureyes.moai.backend.domain.ai.dto.response.SidebarSummariesResponse;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


public interface AiService {

    CreateAiSummaryResponse createSummary(int ownerId, CreateAiSummaryRequest req);
    DashboardSummariesResponse getDashboardList(int ownerId);
    SidebarSummariesResponse getSidebarList(int ownerId);
    void deleteSummary(int ownerId, int summaryId);
    void editSummary(int userId, int summaryId, EditAiSummaryRequest request);

}
