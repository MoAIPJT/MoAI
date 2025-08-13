package com.foureyes.moai.backend.domain.study.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.study.dto.request.*;
import com.foureyes.moai.backend.domain.study.dto.response.*;
import com.foureyes.moai.backend.domain.study.service.StudyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Study API", description = "스터디 관리 기능")
@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private static final Logger log = LoggerFactory.getLogger(StudyController.class);
    private final StudyService studyService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Bearer 토큰에서 사용자 ID를 추출하는 공통 메서드
     */
    private int extractUserIdFromToken(String bearerToken) {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        return jwtTokenProvider.getUserId(token);
    }


    /**
     * 입력: CreateStudyRequest (스터디 생성 요청 정보)
     * 출력: StudyResponseDto (생성된 스터디 정보)
     * 기능: 새로운 스터디를 생성하고 요청자를 관리자로 등록
     **/
    @Operation(
        summary = "스터디 생성",
        description = "스터디 이름, 설명, 대표 이미지를 등록하여 새 스터디를 생성합니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudyResponseDto> createStudy(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @Valid @ModelAttribute CreateStudyRequest request) {
        log.info("스터디 생성 API 호출: 스터디명={}", request.getName());

        int userId = extractUserIdFromToken(bearerToken);
        StudyResponseDto response = studyService.createStudy(userId, request);

        log.info("스터디 생성 완료: studyId={}, userId={}", response.getId(), userId);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * 입력: studyId (스터디 ID)
     * 출력: String (요청 결과 메시지)
     * 기능: 사용자가 특정 스터디에 가입 요청을 전송
     **/
    @Operation(
        summary = "스터디 가입 요청 전송",
        description = "사용자가 특정 스터디에 가입 요청을 전송합니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/join")
    public ResponseEntity<String> sendJoinRequest(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @RequestParam("study_id") int studyId
    ) {
        log.info("스터디 가입 요청 API 호출: studyId={}", studyId);

        int userId = extractUserIdFromToken(bearerToken);
        studyService.sendJoinRequest(userId, studyId);

        log.info("스터디 가입 요청 완료: userId={}, studyId={}", userId, studyId);
        return ResponseEntity.ok("OK");
    }

    /**
     * 입력: studyId (스터디 ID)
     * 출력: List<StudyMemberListResponseDto> (스터디 멤버 목록)
     * 기능: 유저가 참여 중인 스터디의 모든 멤버 이름과 역할을 조회
     **/
    @Operation(
        summary = "스터디 멤버 목록 조회",
        description = "유저가 참여 중인 스터디의 모든 멤버 이름과 역할을 반환합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/{study_id}/members")
    public ResponseEntity<List<StudyMemberListResponseDto>> getMembers(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @PathVariable("study_id") int studyId
    ) {
        log.info("스터디 멤버 목록 조회 API 호출: studyId={}", studyId);

        int userId = extractUserIdFromToken(bearerToken);
        List<StudyMemberListResponseDto> members =
            studyService.getStudyMembers(userId, studyId);

        log.info("스터디 멤버 목록 조회 완료: studyId={}, memberCount={}", studyId, members.size());
        return ResponseEntity.ok(members);
    }
    /**
     * 입력: Authorization Header (Bearer Token)
     * 출력: List<StudyListResponseDto> (사용자 스터디 목록)
     * 기능: 유저가 가입 혹은 신청한 스터디 목록을 조회
     **/
    @Operation(
        summary = "참여/승인 대기 중인 스터디 조회",
        description = "유저가 가입 혹은 신청한 스터디 목록을 반환합니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/all")
    public ResponseEntity<List<StudyListResponseDto>> listUserStudies(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken
    ) {
        log.info("사용자 스터디 목록 조회 API 호출");

        int userId = extractUserIdFromToken(bearerToken);
        List<StudyListResponseDto> studies = studyService.getUserStudies(userId);

        log.info("사용자 스터디 목록 조회 완료: userId={}, studyCount={}", userId, studies.size());
        return ResponseEntity.ok(studies);
    }

    @Operation(
        summary     = "스터디 탈퇴",
        description = "유저가 스터디에서 탈퇴하여 상태를 LEFT 로 변경합니다.",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/leave")
    public ResponseEntity<Void> leaveStudy(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @RequestBody StudyIdRequestDto request
    ) {
        int userId = extractUserIdFromToken(bearerToken);
        studyService.leaveStudy(userId, request.getStudyGroupId());
        return ResponseEntity.ok().build();
    }
    @Operation(
        summary     = "스터디 멤버 삭제(강제탈퇴)",
        description = "관리자가 특정 유저를 스터디에서 강제 탈퇴시킵니다.",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/delete")
    public ResponseEntity<Void> deleteMember(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @RequestBody StudyMemberDeleteRequestDto request
    ) {
        int adminUserId = extractUserIdFromToken(bearerToken);

        studyService.deleteMember(
            adminUserId,
            request.getStudyId(),
            request.getUserId()
        );

        return ResponseEntity.ok().build();
    }
    @Operation(
        summary     = "스터디 멤버 권한 변경(관리자 지정)",
        description = "관리자가 특정 유저의 역할을 변경합니다. ADMIN 지정 시 기존 ADMIN은 MEMBER로 변경됩니다.",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/designate")
    public ResponseEntity<Void> designateMember(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,

        @RequestBody StudyMemberRoleChangeRequestDto request
    ) {
        int adminUserId = extractUserIdFromToken(bearerToken);
        int studyId = request.getStudyId();
        int targetUserId = request.getUserId();
        String newRole = request.getRole();

        studyService.changeMemberRole(adminUserId, studyId, targetUserId, newRole);
        return ResponseEntity.ok().build();
    }
    @Operation(
        summary     = "스터디 가입 요청 거절",
        description = "관리자가 가입 요청 중인 유저를 거절하여 DB에서 멤버십을 삭제합니다.",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/reject")
    public ResponseEntity<Void> rejectJoin(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @RequestBody StudyMemberRejectRequestDto request
    ) {
        int adminUserId = extractUserIdFromToken(bearerToken);

        studyService.rejectJoinRequest(
            adminUserId,
            request.getStudyId(),
            request.getUserId()
        );

        return ResponseEntity.ok().build();
    }
    @Operation(
        summary     = "가입 요청 승인",
        description = "관리자가 스터디 가입 요청을 승인하고 해당 유저의 상태를 PENDING→APPROVED로 변경합니다",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/accept")
    public ResponseEntity<Void> acceptJoin(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,

        @RequestBody AcceptJoinRequestDto request
    ) {
        int adminUserId = extractUserIdFromToken(bearerToken);

        studyService.acceptJoinRequest(
            adminUserId,
            request.getStudyId(),
            request.getUserId(),
            request.getRole()
        );

        return ResponseEntity.ok().build();
    }

    @Operation(
        summary     = "가입 요청 목록 조회(관리자용)",
        description = "관리자가 자신의 스터디에 온 모든 가입 요청을 조회합니다.",
        security    = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/list/management")
    public ResponseEntity<List<JoinRequestResponseDto>> getPendingRequests(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @Parameter(description = "스터디 ID", example = "101")
        @RequestParam("studyId") int studyId
    ) {
        int adminUserId = extractUserIdFromToken(bearerToken);

        List<JoinRequestResponseDto> requests =
            studyService.getPendingJoinRequests(adminUserId, studyId);

        return ResponseEntity.ok(requests);
    }

    @Operation(
        summary = "참여 중인 스터디 목록 조회",
        description = "현재 로그인한 사용자가 참여 중인 모든 스터디 정보를 반환합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/list")
    public ResponseEntity<List<JoinStudyListResponseDto>> getJoinedStudies(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken
    ) {
        int userId = extractUserIdFromToken(bearerToken);

        List<JoinStudyListResponseDto> studies = studyService.getJoinedStudies(userId);
        return ResponseEntity.ok(studies);
    }

    @Operation(
        summary = "스터디 정보 조회(디테일 페이지, hashId 기반)",
        description = "hashId로 스터디 상세 정보를 조회합니다. 상태/역할은 현재 사용자 기준입니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/detail")
    public ResponseEntity<StudyDetailResponseDto> getStudyDetailByHash(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,

        @Parameter(description = "라우팅/공유용 해시 ID", example = "jR4kd8Lz", required = true, schema = @Schema(type = "string"))
        @RequestParam("hashId") String hashId
    ) {
        int userId = extractUserIdFromToken(bearerToken);

        StudyDetailResponseDto dto = studyService.getStudyDetailByHashId(userId, hashId);
        return ResponseEntity.ok(dto);
    }

    @Operation(
        summary = "스터디 공지사항 조회",
        description = "studyId로 해당 스터디의 공지사항을 조회합니다. 승인된 멤버만 접근 가능합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/notice")
    public ResponseEntity<StudyNoticeResponseDto> getStudyNotice(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,

        @Parameter(description = "스터디 ID", example = "101", required = true)
        @RequestParam("studyId") int studyId
    ) {
        int userId = extractUserIdFromToken(bearerToken);

        StudyNoticeResponseDto dto = studyService.getStudyNotice(userId, studyId);
        return ResponseEntity.ok(dto);
    }

    @Operation(
        summary = "스터디 공지사항 수정",
        description = "승인된 관리자만 공지사항을 수정할 수 있습니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/notice")
    public ResponseEntity<String> updateNotice(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @Valid @RequestBody UpdateStudyNoticeRequestDto request
    ) {
        int userId = extractUserIdFromToken(bearerToken);

        studyService.updateStudyNotice(userId, request.getStudyId(), request.getNotice());

        return ResponseEntity.ok("수정완료");
    }

    @Operation(
            summary = "스터디 수정",
            description = "승인된 관리자만 수정할 수 있습니다.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping(path = "/{study_id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateGroup(
            @Parameter(hidden = true)
            @PathVariable("study_id") int studyId,
            @RequestHeader("Authorization") String bearerToken,
            @Valid @ModelAttribute UpdateStudyRequestDto request   // ❗ @RequestBody → @ModelAttribute
    ) {
        int userId = extractUserIdFromToken(bearerToken);
        studyService.updateStudyGroup(userId, studyId, request);
        return ResponseEntity.ok("수정완료");
    }
}
