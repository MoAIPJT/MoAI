# 프론트엔드 코드 컨벤션 및 스니펫 사용 가이드 (React)

이 문서는 React 프로젝트의 일관된 코드 스타일을 유지하기 위한 `.editorconfig` 설정과, React 개발 시 유용하게 사용할 수 있는 스니펫(Snippets) 파일의 사용법을 안내합니다.

## 1. EditorConfig (`.editorconfig`)

`.editorconfig` 파일은 다양한 에디터와 IDE에서 코드 스타일을 일관되게 유지할 수 있도록 도와주는 설정 파일입니다. 프론트엔드(React) 개발을 위해 `.editorconfig`에 다음과 같은 규칙이 추가되었습니다.

### 주요 설정 (React 관련)
- **들여쓰기(Indentation)**: `.js`, `.jsx`, `.ts`, `.tsx` 파일에 대해 공백(space) 2칸

### 사용 방법
- **IntelliJ IDEA**: 별도의 설정 없이 프로젝트를 열면 `.editorconfig` 파일을 자동으로 인식하여 적용합니다.
- **VS Code**: [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 확장 프로그램을 설치하면 자동으로 설정을 인식하고 적용합니다.

---

## 2. 코드 스니펫 (Code Snippets)

코드 스니펫은 반복적으로 사용되는 코드 패턴을 미리 등록해두고, 간단한 키워드 입력만으로 전체 코드를 자동 완성하는 기능입니다. React 개발을 위해 다음과 같은 스니펫들이 등록되어 있습니다.

### 등록된 스니펫 목록

1.  **React 함수형 컴포넌트 (Functional Component)**
    *   **키워드**: `rfc`
    *   **기능**: 기본적인 React 함수형 컴포넌트 구조를 생성합니다.
    *   **생성 코드 예시**:
        ```jsx
        import React from 'react';

        function YourComponentName() {
          return (
            <div>
              {/* ... */}
            </div>
          );
        }

        export default YourComponentName;
        ```

2.  **React 함수형 컴포넌트 (Props 포함)**
    *   **키워드**: `rfcp`
    *   **기능**: Props 인터페이스를 포함하는 React 함수형 컴포넌트 구조를 생성합니다.
    *   **생성 코드 예시**:
        ```tsx
        import React from 'react';

        interface YourComponentNameProps {
          // props 정의
        }

        function YourComponentName({ /* props */ }: YourComponentNameProps) {
          return (
            <div>
              {/* ... */}
            </div>
          );
        }

        export default YourComponentName;
        ```

3.  **`useState` Hook**
    *   **키워드**: `usestate`
    *   **기능**: React의 `useState` 훅을 사용하여 상태 변수를 선언합니다.
    *   **생성 코드 예시**:
        ```jsx
        const [name, setName] = React.useState(initialValue);
        ```

4.  **`useEffect` Hook**
    *   **키워드**: `useeffect`
    *   **기능**: React의 `useEffect` 훅을 사용하여 부수 효과(side effect)를 처리합니다.
    *   **생성 코드 예시**:
        ```jsx
        React.useEffect(() => {
          // effect
        }, [dependencies]);
        ```

5.  **`useRef` Hook**
    *   **키워드**: `useref`
    *   **기능**: React의 `useRef` 훅을 사용하여 DOM 요소 또는 변경 가능한 값을 참조합니다.
    *   **생성 코드 예시**:
        ```jsx
        const nameRef = React.useRef(initialValue);
        ```

### IDE별 스니펫 사용 방법

#### A. IntelliJ IDEA (WebStorm 등)

1.  프론트엔드 프로젝트 루트의 `.idea/liveTemplates/React.xml` 파일이 스니펫 설정 파일입니다. (아직 생성되지 않았다면, 수동으로 생성해야 합니다.)
2.  IntelliJ는 이 파일을 자동으로 인식합니다. (별도 설정 불필요)
3.  JavaScript/TypeScript/JSX/TSX 파일 편집기에서 해당 **키워드**를 입력한 후 `Tab` 또는 `Enter` 키를 누르면 스니펫이 확장됩니다.
4.  변수 필드는 `Tab` 키를 눌러가며 이동하고 내용을 입력할 수 있습니다.

> **참고**: 만약 스니펫이 동작하지 않는다면, IDE를 재시작하거나 `.idea` 디렉토리가 프로젝트 설정에 올바르게 포함되었는지 확인해주세요.

#### B. VS Code

1.  프론트엔드 프로젝트 루트의 `.vscode/react.json` 파일이 스니펫 설정 파일입니다.
2.  VS Code는 이 파일을 자동으로 인식합니다. (별도 설정 불필요)
3.  JavaScript/TypeScript/JSX/TSX 파일 편집기에서 해당 **키워드**를 입력하면 자동 완성 목록에 스니펫이 나타납니다. 해당 항목을 선택하고 `Tab` 또는 `Enter` 키를 누르면 코드가 완성됩니다.
4.  변수 필드는 `Tab` 키를 눌러가며 이동하고 내용을 입력할 수 있습니다. `$0`은 최종 커서 위치를 나타냅니다.

> **참고**: VS Code에서 React 개발을 위해서는 관련 확장 프로그램(예: ESLint, Prettier, React Extension Pack) 설치가 권장됩니다.

---

이 가이드를 통해 모든 팀원이 일관된 스타일과 규칙으로 코드를 작성하여 생산성과 코드 품질을 높일 수 있기를 기대합니다.
