package com.foureyes.moai.backend.domain.ai.internal;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Slf4j
@Component
public class PdfTextExtractor {

    /** PDF에서 페이지 라벨과 함께 텍스트 추출 */
    public String extractTextWithPages(InputStream inputStream, String fileName) throws Exception {
        log.info("PDF 텍스트 추출 시작: {}", fileName);
        StringBuilder fullText = new StringBuilder();
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            for (int pageNum = 1; pageNum <= document.getNumberOfPages(); pageNum++) {
                stripper.setStartPage(pageNum);
                stripper.setEndPage(pageNum);
                String pageText = stripper.getText(document);
                fullText.append("--- Page ").append(pageNum).append(" --- ")
                    .append(pageText).append(" ");
            }
        }
        log.info("PDF 텍스트 추출 완료: {}", fileName);
        return fullText.toString();
    }
}
