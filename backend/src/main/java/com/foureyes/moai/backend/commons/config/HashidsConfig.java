package com.foureyes.moai.backend.commons.config;

import org.hashids.Hashids;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HashidsConfig {
    @Bean
    public Hashids hashids() {
        //TODO 환경변수 설정해야함
        return new Hashids("test_salt", 8);
    }
}
