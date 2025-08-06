package com.foureyes.moai.backend.commons.util;

import com.foureyes.moai.backend.commons.config.B2Properties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final S3Client s3Client;
    private final B2Properties props;

    public String uploadFile(MultipartFile file) throws IOException {

        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        // 중복 방지를 위한 UUID 키 생성
        String key = UUID.randomUUID().toString() + ext;
        // 업로드 요청 빌드 (contentType, contentLength 포함)
        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(props.getBucketName())
            .key(key)
            .contentType(file.getContentType())
            .contentLength(file.getSize())
            .build();

        PutObjectResponse response = s3Client.putObject(
            request,
            RequestBody.fromInputStream(file.getInputStream(), file.getSize())
        );
        S3Utilities util = s3Client.utilities();
        String url = util.getUrl(GetUrlRequest.builder()
                .bucket(props.getBucketName())
                .key(key)
                .build())
            .toExternalForm();

        return url;
    }
}
