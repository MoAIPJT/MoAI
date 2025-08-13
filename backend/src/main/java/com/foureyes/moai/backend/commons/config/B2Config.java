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
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(B2Properties.class)
@RequiredArgsConstructor
public class B2Config {

    private final B2Properties props;

    @Bean
    public S3Client s3Client() throws Exception {
        return S3Client.builder()

            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(
                    props.getAccessKey(),
                    props.getSecretKey()
                )
            ))
            .region(Region.of(props.getRegion()))
            .endpointOverride(new URI(props.getEndpoint()))
            .serviceConfiguration(S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build())
            .build();
    }
    @Bean
    public S3Presigner s3Presigner() throws Exception {
        return S3Presigner.builder()
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey())))
            .region(Region.of(props.getRegion()))
            .endpointOverride(new URI(props.getEndpoint()))
            .build();
    }
}
