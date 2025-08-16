package com.foureyes.moai.backend.domain.ai.internal;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PromptBuilder {

    /** 멀티 문서 프롬프트 (사용자 프롬프트 병합) */
    public String buildMultiDocPrompt(String joinedDocBlocks, String userPrompt) {
        String base = """
            당신은 전문적인 문서 요약가입니다. 여러 PDF 문서를 한 번에 요약합니다.
            각 요약 항목에는 반드시 아래 필드를 포함하세요:
            - summarySentence: 요약 문장 (간결하고 핵심 위주)
            - originalQuote: 요약의 근거가 되는 원문을 PDF에서 그대로 복사한 텍스트 (절대 편집하지 말고 원본 그대로)
            - docsId: 요약이 나온 문서의 식별자 (아래 DOC 블록의 docsId 값 그대로)
            - pageNumber: 근거 구절이 나온 페이지 번호 (정수)

            출력 형식은 다음 JSON 리스트와 정확히 일치해야 합니다:
            [
              {
                "summarySentence": "요약된 문장입니다.",
                "originalQuote": "PDF에서 그대로 복사한 원본 텍스트입니다. 절대 편집하거나 요약하지 마세요.",
                "docsId": 101,
                "pageNumber": 3
              }
            ]

            중요한 규칙:
            - 반드시 유효한 JSON만 출력합니다(백틱, 마크다운 금지).
            - originalQuote는 PDF 원문을 정확히 그대로 복사해야 합니다. 한 글자도 바꾸지 마세요.
            - 띄어쓰기, 줄바꿈, 구두점까지 모두 원본과 동일해야 합니다.
            - 페이지 라벨은 \"--- Page N ---\" 형식입니다.
            - 각 항목은 단일 문장 요약(문장부호 포함 200자 이내 권장).
            - 동일 내용 중복 요약은 피하세요.
            """;

        if (userPrompt != null && !userPrompt.isBlank()) {
            base += "\n\n추가 지침: " + userPrompt.trim();
        }
        return base + "\n\n아래에 여러 문서의 내용이 포함되어 있습니다(DOC 블록):\n" + joinedDocBlocks;
    }

    /** DOC 블록 포맷 */
    public String formatDocBlock(Integer docsId, String fileName, String textWithPages) {
        String safeName = Optional.ofNullable(fileName).orElse("document-" + docsId);
        return """
               === DOC START ===
               docsId: %d
               fileName: %s
               content:
               %s
               === DOC END ===
               """.formatted(docsId, safeName, textWithPages);
    }

    /** 문자 단위 컷오프 */
    public String clip(String text, int maxChars) {
        if (text == null) return "";
        if (text.length() <= maxChars) return text;
        return text.substring(0, maxChars) + "\n... [TRUNCATED]";
    }
}
