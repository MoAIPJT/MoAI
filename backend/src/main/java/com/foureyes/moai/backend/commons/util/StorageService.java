package com.foureyes.moai.backend.commons.util;

import com.foureyes.moai.backend.commons.config.B2Properties;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final B2Properties props;

    // 최대 파일 크기 (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    // 허용된 이미지 파일 확장자
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"
    );

    /**
     * 문서(예: PDF) 업로드: 비공개 버킷에 저장하고 key만 반환
     * - B2Properties에 docsBucketName 필드가 있어야 합니다.
     */
    public String uploadDocument(MultipartFile file, int studyId) throws IOException {
        if (file == null || file.isEmpty()) throw new CustomException(ErrorCode.INVALID_REQUEST);

        final String ct = file.getContentType();
        if (ct == null || !ct.equalsIgnoreCase("application/pdf")) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        final String key = buildDocKey(studyId, ".pdf"); // 예: ref/123/2025/08/uuid.pdf

        try {
            PutObjectRequest req = PutObjectRequest.builder()
                .bucket(props.getDocsBucketName())
                .key(key)
                .contentType("application/pdf")
                .build();

            s3Client.putObject(req, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return key; // 비공개이므로 URL이 아니라 key만 DB에 저장
        } catch (Exception e) {
            log.error("문서 업로드 실패: studyId={}, error={}", studyId, e.getMessage(), e);
            throw new IOException("문서 업로드 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 공개 이미지 업로드: 공개 버킷에 저장하고 접근 가능한 URL 반환
     */
    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            log.warn("허용되지 않은 파일 확장자: {}", ext);
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        String key = UUID.randomUUID().toString() + ext;
        log.info("파일 업로드 시작: originalName={}, key={}, size={}", originalName, key, file.getSize());

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(props.getBucketName())
                .key(key)
                .contentType(file.getContentType())
                .build();

            s3Client.putObject(
                request,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            // 클라이언트의 endpoint 설정을 이용해 URL 생성 (B2 S3 호환)
            S3Utilities util = s3Client.utilities();
            String url = util.getUrl(
                GetUrlRequest.builder()
                    .bucket(props.getBucketName())
                    .key(key)
                    .build()
            ).toExternalForm();

            log.info("파일 업로드 완료: url={}", url);
            return url;

        } catch (Exception e) {
            log.error("파일 업로드 실패: originalName={}, error={}", originalName, e.getMessage(), e);
            throw new IOException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 비공개 문서(PDF) 조회용 Pre-signed URL 생성
     * - SDK v2: GetObjectPresignRequest / PresignedGetObjectRequest 사용
     */
    public String presignDocumentViewUrl(String key, Duration ttl) {
        GetObjectRequest get = GetObjectRequest.builder()
            .bucket(props.getDocsBucketName())
            .key(key)
            // 브라우저에서 인라인 미리보기 유도
            .responseContentType("application/pdf")
            .responseContentDisposition("inline; filename=\"" + Paths.get(key).getFileName().toString() + "\"")
            .build();

        GetObjectPresignRequest preReq = GetObjectPresignRequest.builder()
            .signatureDuration(ttl) // 예: Duration.ofMinutes(60)
            .getObjectRequest(get)
            .build();

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(preReq);
        return presigned.url().toString();
    }
    /**
     * 비공개 문서(PDF) 다운용 Pre-signed URL 생성
     * - SDK v2: GetObjectPresignRequest / PresignedGetObjectRequest 사용
     */
    public String presignDocumentDownloadUrl(String key, Duration ttl) {
        // 키에서 파일명만 추출
        String filename = Paths.get(key).getFileName().toString();
        // RFC5987 (UTF-8) 인코딩: 공백 + → %20 보정
        String encoded = java.net.URLEncoder.encode(filename, java.nio.charset.StandardCharsets.UTF_8)
            .replace("+", "%20");

        // 다운로드 강제 (attachment)
        software.amazon.awssdk.services.s3.model.GetObjectRequest get =
            software.amazon.awssdk.services.s3.model.GetObjectRequest.builder()
                .bucket(props.getDocsBucketName())
                .key(key)
                .responseContentType("application/pdf")
                .responseContentDisposition(
                    // ASCII fallback + UTF-8 확장
                    "attachment; filename=\"" + filename.replace("\"","") + "\"; filename*=UTF-8''" + encoded
                )
                .build();

        software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest preReq =
            software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest.builder()
                .signatureDuration(ttl) // 예: Duration.ofMinutes(60)
                .getObjectRequest(get)
                .build();

        return s3Presigner.presignGetObject(preReq).url().toString();
    }

    /**
     * 파일 유효성 검증
     */
    private void validateFile(MultipartFile file) {
        if (file == null) {
            log.warn("파일이 null입니다");
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        if (file.isEmpty()) {
            log.warn("빈 파일입니다");
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            log.warn("파일 크기가 제한을 초과했습니다: size={}, maxSize={}", file.getSize(), MAX_FILE_SIZE);
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            log.warn("파일명이 없습니다");
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    private String buildDocKey(int studyId, String ext) {
        LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
        return String.format(
            "ref/%d/%04d/%02d/%s%s",
            studyId, now.getYear(), now.getMonthValue(), UUID.randomUUID(), ext
        );
    }
}
