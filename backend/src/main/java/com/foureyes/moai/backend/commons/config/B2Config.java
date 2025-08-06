package com.foureyes.moai.backend.commons.config;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(B2Properties.class)
@RequiredArgsConstructor
public class B2Config {

    private final B2Properties props;

    @Bean
    public S3Client s3Client() throws Exception {
        return S3Client.builder()
            // 1) 자격 증명
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(
                    props.getAccessKey(),
                    props.getSecretKey()
                )
            ))
            // 2) 리전
            .region(Region.of(props.getRegion()))
            // 3) Backblaze B2 엔드포인트
            .endpointOverride(new URI(props.getEndpoint()))
            // 4) path-style 액세스 활성화
            .serviceConfiguration(S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build())
            .build();
    }
}
