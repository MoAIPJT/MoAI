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
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final S3Client s3Client;
    private final B2Properties props;
    
    // 허용된 이미지 파일 확장자
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"
    );
    
    // 최대 파일 크기 (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
        }
        
        // 파일 확장자 검증
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            log.warn("허용되지 않은 파일 확장자: {}", ext);
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
        
        // 중복 방지를 위한 UUID 키 생성
        String key = UUID.randomUUID().toString() + ext;
        
        log.info("파일 업로드 시작: originalName={}, key={}, size={}", originalName, key, file.getSize());
        
        try {
            // 업로드 요청 빌드 (contentType, contentLength 포함)
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(props.getBucketName())
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

            s3Client.putObject(
                request,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
            
            S3Utilities util = s3Client.utilities();
            String url = util.getUrl(GetUrlRequest.builder()
                    .bucket(props.getBucketName())
                    .key(key)
                    .build())
                .toExternalForm();

            log.info("파일 업로드 완료: url={}", url);
            return url;
            
        } catch (Exception e) {
            log.error("파일 업로드 실패: originalName={}, error={}", originalName, e.getMessage());
            throw new IOException("파일 업로드 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
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
}
