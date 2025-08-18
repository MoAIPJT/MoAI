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
                <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #AA64FF; border-radius:5px; overflow:hidden;">
                    <div style="background-color:#AA64FF; padding:20px; text-align:center;">
                        <h1 style="color:white; margin:0; font-size:28px;">이메일 인증</h1>
                    </div>
                    <div style="padding:30px; background-color:white; text-align:center;">
                        <p style="font-size:16px; color:#333; margin-bottom:25px;">회원가입을 해 주셔서 감사합니다.</p>
                        <div style="border:1px solid #AA64FF; padding:20px; margin-bottom:25px; border-radius:5px;">
                            <p style="font-size:16px; color:#333; margin:0;">이메일 인증을 위해 클릭을 해 주세요.</p>
                        </div>
                        <a href="%s" style="display:inline-block; padding:12px 30px; background-color:#AA64FF; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">이메일 인증</a>
                    </div>
                </div>
                """.formatted(link);

            case PASSWORD_RESET -> """
                <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #ddd; border-radius:5px; overflow:hidden;">
                    <div style="background-color:#8e5e93; padding:20px; text-align:center;">
                        <h1 style="color:white; margin:0; font-size:28px;">비밀번호 재설정</h1>
                    </div>
                    <div style="padding:30px; background-color:white; text-align:center;">
                        <p style="font-size:16px; color:#333; margin-bottom:25px;">비밀번호 재설정 요청이 접수되었습니다.</p>
                        <div style="border:1px solid #AA64FF; padding:20px; margin-bottom:25px; border-radius:5px;">
                            <p style="font-size:16px; color:#333; margin:0;">아래 버튼을 클릭하여 새 비밀번호를 설정해주세요. 유효시간은 30분입니다.</p>
                        </div>
                        <a href="%s" style="display:inline-block; padding:12px 30px; background-color:#AA64FF; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">비밀번호 재설정하기</a>
                    </div>
                </div>
        """.formatted(link);
        };
    }
}
