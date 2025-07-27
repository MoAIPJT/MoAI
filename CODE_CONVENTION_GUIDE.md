# 코드 컨벤션 및 스니펫 사용 가이드

이 문서는 프로젝트의 일관된 코드 스타일을 유지하기 위한 `.editorconfig` 파일과, 공통적으로 사용되는 코드 조각을 쉽게 입력할 수 있도록 도와주는 스니펫(Snippets) 파일의 사용법을 안내합니다.

## 1. EditorConfig (`.editorconfig`)

`.editorconfig` 파일은 다양한 에디터와 IDE에서 코드 스타일을 일관되게 유지할 수 있도록 도와주는 설정 파일입니다. 우리 프로젝트의 `.editorconfig`는 Google Java 스타일 가이드를 기반으로 설정되어 있습니다.

### 주요 설정
- **들여쓰기(Indentation)**: 공백(space) 4칸
- **최대 줄 길이(Max line length)**: 100자
- **문자셋(Charset)**: UTF-8
- **줄바꿈(End of line)**: LF
- 그 외 후행 공백 제거 등

### 사용 방법
- **IntelliJ IDEA**: 별도의 설정 없이 프로젝트를 열면 `.editorconfig` 파일을 자동으로 인식하여 적용합니다.
- **VS Code**: [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 확장 프로그램을 설치하면 자동으로 설정을 인식하고 적용합니다.

---

## 2. 코드 스니펫 (Code Snippets)

코드 스니펫은 반복적으로 사용되는 코드 패턴을 미리 등록해두고, 간단한 키워드 입력만으로 전체 코드를 자동 완성하는 기능입니다. 현재 다음과 같은 스니펫들이 등록되어 있습니다.

### 등록된 스니펫 목록

1.  **SLF4J 로거 (Logger)**
    *   **키워드**: `log`
    *   **기능**: `private static final org.slf4j.Logger log = ...` 코드를 현재 클래스에 맞게 자동으로 생성합니다.
    *   **생성 코드 예시**:
        ```java
        private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(YourClassName.class);
        ```

2.  **Spring `@GetMapping` 메서드**
    *   **키워드**: `getmap`
    *   **기능**: `@GetMapping` 어노테이션이 붙은 HTTP GET 요청 처리 메서드를 생성합니다. 메서드 상단에 주석을 추가하여 기능 설명을 작성할 수 있습니다.
    *   **생성 코드 예시**:
        ```java
        /**
         * 입력:
         * 출력:
         * 기능:
         **/
        @org.springframework.web.bind.annotation.GetMapping("/path")
        public ResponseEntity<?> methodName(String params) {
            // ...
        }
        ```

3.  **Spring `@PostMapping` 메서드**
    *   **키워드**: `postmap`
    *   **기능**: `@PostMapping` 어노테이션이 붙은 HTTP POST 요청 처리 메서드를 생성합니다. `@RequestBody`를 포함하며, 메서드 상단에 주석을 추가하여 기능 설명을 작성할 수 있습니다.
    *   **생성 코드 예시**:
        ```java
        /**
         * 입력:
         * 출력:
         * 기능:
         **/
        @org.springframework.web.bind.annotation.PostMapping("/path")
        public ResponseEntity<?> methodName(@org.springframework.web.bind.annotation.RequestBody Dto dto) {
            // ...
        }
        ```

4.  **Spring `@PutMapping` 메서드**
    *   **키워드**: `putmap`
    *   **기능**: `@PutMapping` 어노테이션이 붙은 HTTP PUT 요청 처리 메서드를 생성합니다. `@RequestBody`를 포함하며, 메서드 상단에 주석을 추가하여 기능 설명을 작성할 수 있습니다.
    *   **생성 코드 예시**:
        ```java
        /**
         * 입력:
         * 출력:
         * 기능:
         **/
        @org.springframework.web.bind.annotation.PutMapping("/path")
        public ResponseEntity<?> methodName(@org.springframework.web.bind.annotation.RequestBody Dto dto) {
            // ...
        }
        ```

5.  **Spring `@DeleteMapping` 메서드**
    *   **키워드**: `delmap`
    *   **기능**: `@DeleteMapping` 어노테이션이 붙은 HTTP DELETE 요청 처리 메서드를 생성합니다. 메서드 상단에 주석을 추가하여 기능 설명을 작성할 수 있습니다.
    *   **생성 코드 예시**:
        ```java
        /**
         * 입력:
         * 출력:
         * 기능:
         **/
        @org.springframework.web.bind.annotation.DeleteMapping("/path")
        public ResponseEntity<?> methodName() {
            // ...
        }
        ```

6.  **Spring `@Autowired` 의존성 주입**
    *   **키워드**: `autowired`
    *   **기능**: `@Autowired` 어노테이션을 사용하여 의존성을 주입하는 필드를 생성합니다.
    *   **생성 코드 예시**:
        ```java
        @org.springframework.beans.factory.annotation.Autowired
        private Service service;
        ```

7.  **일반 서비스 메서드**
    *   **키워드**: `svcm`
    *   **기능**: 일반적인 서비스 계층 메서드의 기본 구조를 생성합니다. 메서드 상단에 주석을 추가하여 기능 설명을 작성할 수 있습니다.
    *   **생성 코드 예시**:
        ```java
        /**
         * 입력:
         * 출력:
         * 기능:
         **/
        public void methodName(String params) {
            // ...
        }
        ```

### IDE별 스니펫 사용 방법

#### A. IntelliJ IDEA

1.  프로젝트 루트의 `.idea/liveTemplates/Java.xml` 파일이 스니펫 설정 파일입니다.
2.  IntelliJ는 이 파일을 자동으로 인식합니다. (별도 설정 불필요)
3.  Java 파일 편집기에서 해당 **키워드**를 입력한 후 `Tab` 또는 `Enter` 키를 누르면 스니펫이 확장됩니다.
4.  주석 필드(`$COMMENT$`)와 변수 필드(`$PATH$`, `$RETURN_TYPE$`, `$METHOD_NAME$`, `$PARAMS$`, `$DTO$`, `$SERVICE$`, `$service$`)는 `Tab` 키를 눌러가며 이동하고 내용을 입력할 수 있습니다.

> **참고**: 만약 스니펫이 동작하지 않는다면, IDE를 재시작하거나 `.idea` 디렉토리가 프로젝트 설정에 올바르게 포함되었는지 확인해주세요.

#### B. VS Code

1.  프로젝트 루트의 `.vscode/java.json` 파일이 스니펫 설정 파일입니다.
2.  VS Code는 이 파일을 자동으로 인식합니다. (별도 설정 불필요)
3.  Java 파일 편집기에서 해당 **키워드**를 입력하면 자동 완성 목록에 스니펫이 나타납니다. 해당 항목을 선택하고 `Tab` 또는 `Enter` 키를 누르면 코드가 완성됩니다.
4.  주석 필드(`$1`)와 변수 필드(`$2`, `$3`, `$4`, `$5`, `$0`)는 `Tab` 키를 눌러가며 이동하고 내용을 입력할 수 있습니다. `$0`은 최종 커서 위치를 나타냅니다.

> **참고**: VS Code에서 Java 개발을 위해서는 [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) 설치가 권장됩니다.

---
