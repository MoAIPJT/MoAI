package com.foureyes.moai.backend.commons.mail;

import org.springframework.stereotype.Component;


@Component
public class EmailTemplateProvider {

    public String getSubject(EmailType type) {
        return switch (type) {
            case VERIFY -> "[MOAI] 이메일 인증을 완료해주세요!";
            case PASSWORD_RESET -> "[MOAI] 비밀번호 재설정 링크입니다.";
            // case INVITATION -> ...
        };
    }

    public String getBody(EmailType type, String link) {
        return switch (type) {
            case VERIFY -> """
                <div style="font-family:Arial,sans-serif; padding:20px;">
                    <h2>MOAI 회원가입을 환영합니다 🎉</h2>
                    <p>아래 버튼을 클릭해서 이메일 인증을 완료해주세요. 인증 유효 시간은 24시간입니다.</p>
                    <a href="%s" style="display:inline-block; padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">이메일 인증하기</a>
                </div>
                """.formatted(link);

            case PASSWORD_RESET -> """
            <div style="font-family:Arial,sans-serif; padding:20px;">
                <h2>비밀번호 재설정 요청이 접수되었습니다 🔐</h2>
                <p>아래 버튼을 클릭하여 새 비밀번호를 설정해주세요. 유효시간은 30분입니다.</p>
                <a href="%s" style="display:inline-block; padding:10px 20px; background-color:#007BFF; color:white; text-decoration:none; border-radius:5px;">비밀번호 재설정하기</a>
            </div>
        """.formatted(link);
        };
    }
}
