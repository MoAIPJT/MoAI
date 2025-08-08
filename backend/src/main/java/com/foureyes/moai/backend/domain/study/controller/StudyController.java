package com.foureyes.moai.backend.domain.study.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.study.dto.request.*;
import com.foureyes.moai.backend.domain.study.dto.response.*;
import com.foureyes.moai.backend.domain.study.service.StudyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Study API", description = "스터디 관리 기능")
@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final JwtTokenProvider jwtTokenProvider;


    @Operation(
        summary = "스터디 생성",
        description = "스터디 이름, 설명, 대표 이미지를 등록하여 새 스터디를 생성합니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudyResponseDto> createStudy(
        @Parameter(hidden = true)
        @RequestHeader("Authorization") String bearerToken,
        @ModelAttribute CreateStudyRequest request) {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);
        StudyResponseDto response = studyService.createStudy(userId, request);
        return ResponseEntity.status(201).body(response);
    }

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
    ) throws BadRequestException {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);

        studyService.sendJoinRequest(userId, studyId);
        return ResponseEntity.ok("OK");
    }

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
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);

        List<StudyMemberListResponseDto> members =
            studyService.getStudyMembers(userId, studyId);

        return ResponseEntity.ok(members);
    }
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
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);

        List<StudyListResponseDto> studies = studyService.getUserStudies(userId);
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
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId   = jwtTokenProvider.getUserId(token);
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
        String token     = bearerToken.replaceFirst("^Bearer ", "").trim();
        int adminUserId  = jwtTokenProvider.getUserId(token);

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
        String token        = bearerToken.replaceFirst("^Bearer ", "").trim();
        int adminUserId     = jwtTokenProvider.getUserId(token);
        int studyId         = request.getStudyId();
        int targetUserId    = request.getUserId();
        String newRole      = request.getRole();

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
        String token     = bearerToken.replaceFirst("^Bearer ", "").trim();
        int adminUserId  = jwtTokenProvider.getUserId(token);

        studyService.rejectJoinRequest(
            adminUserId,
            request.getStudyId(),
            request.getUserID()
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
        String token       = bearerToken.replaceFirst("^Bearer ", "").trim();
        int adminUserId    = jwtTokenProvider.getUserId(token);

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
        String token      = bearerToken.replaceFirst("^Bearer ", "").trim();
        int adminUserId   = jwtTokenProvider.getUserId(token);

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
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);

        List<JoinStudyListResponseDto> studies = studyService.getJoinedStudies(userId);
        return ResponseEntity.ok(studies);
    }

}
