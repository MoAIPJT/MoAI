# 프론트엔드 코드 컨벤션 체크리스트

## ✅ 현재 잘 적용된 부분

### 1. 컴포넌트 구조
- [x] Atomic Design Pattern 적용 (atoms, molecules, organisms, templates)
- [x] TypeScript 사용으로 타입 안전성 확보
- [x] React.FC 타입 일관성 유지
- [x] Props 인터페이스 분리 (types.ts 파일)

### 2. 네이밍 컨벤션
- [x] 컴포넌트명: PascalCase
- [x] 변수/함수명: camelCase
- [x] 파일명: camelCase
- [x] 디렉토리명: camelCase

### 3. Import/Export
- [x] 절대 경로 import (@/ 별칭 사용)
- [x] Default export 일관성
- [x] React lazy loading 적용

### 4. 스타일링
- [x] Tailwind CSS 일관성 유지
- [x] 조건부 스타일링 템플릿 리터럴 사용
- [x] className 속성 일관성

## 🔄 개선이 필요한 부분

### 1. 코드 포맷팅 일관성

#### Button 컴포넌트 개선 필요
현재 `Button/index.tsx`에 포맷팅 문제가 있습니다:

```tsx
// 현재 (개선 필요)
const Button:React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', fullWidth=false, onClick, type = 'button', disabled = false, className = '', ...rest}) => {

// 권장 (개선 후)
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => {
```

#### 클래스명 결합 방식 개선
여러 컴포넌트에서 클래스명 결합 방식이 다릅니다:

```tsx
// 현재 (일관성 부족)
const className = `
  ${variantClasses[variant]}
  ${sizeClasses[size]}
  ${fullWidth ? 'w-full' : ''}
  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
`.trim()

// 권장 (cn 유틸리티 사용)
import { cn } from '@/lib/utils'

const className = cn(
  variantClasses[variant],
  sizeClasses[size],
  fullWidth && 'w-full',
  disabled && 'opacity-50 cursor-not-allowed',
  className
)
```

### 2. 컴포넌트 일관성 개선

#### Props 구조분해 일관성
```tsx
// 권장: 명시적 구조분해
const Component: React.FC<Props> = ({
  prop1,
  prop2 = 'default',
  ...rest
}) => {
  // 컴포넌트 로직
}
```

#### 핸들러 함수 네이밍
```tsx
// 권장: handle + 동작명
const handleClick = () => {}
const handleChange = () => {}
const handleSubmit = () => {}
```

### 3. 타입 정의 개선

#### 더 구체적인 타입 정의
```tsx
// 현재
onClick?: () => void

// 권장
onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
```

### 4. 성능 최적화

#### useCallback 및 useMemo 적용
```tsx
import { useCallback, useMemo } from 'react'

const Component: React.FC<Props> = ({ items, onItemClick }) => {
  const memoizedItems = useMemo(() => 
    items.filter(item => item.isActive), 
    [items]
  )

  const handleItemClick = useCallback(
    (id: string) => onItemClick(id),
    [onItemClick]
  )

  // ...
}
```

## 📋 코딩 규칙

### 1. 컴포넌트 작성 순서
```tsx
// 1. imports
import React from 'react'
import type { ComponentProps } from './types'

// 2. 컴포넌트 정의
const Component: React.FC<ComponentProps> = ({
  // props 구조분해
}) => {
  // 3. hooks
  // 4. 핸들러 함수
  // 5. 계산된 값
  // 6. JSX 반환
}

// 7. default export
export default Component
```

### 2. 조건부 렌더링
```tsx
// 권장
{isVisible && <Component />}
{count > 0 ? <Badge count={count} /> : null}

// 지양
{isVisible ? <Component /> : null}
```

### 3. 이벤트 핸들러
```tsx
// 권장: 별도 함수로 분리
const handleClick = (event: React.MouseEvent) => {
  event.preventDefault()
  // 로직
}

return <button onClick={handleClick}>Click</button>

// 지양: 인라인 함수
return <button onClick={(e) => { /* 로직 */ }}>Click</button>
```

### 4. State 관리
```tsx
// 권장: 구체적인 타입
const [user, setUser] = useState<User | null>(null)
const [isLoading, setIsLoading] = useState<boolean>(false)

// 권장: 여러 상태를 객체로 관리 (연관성이 있는 경우)
const [state, setState] = useState({
  data: null,
  loading: false,
  error: null
})
```

## 🛠️ 설정 및 도구

### 1. ESLint 규칙 강화
현재 ESLint 설정에 다음 규칙들 추가 권장:
- `react-hooks/exhaustive-deps`
- `@typescript-eslint/no-unused-vars`
- `@typescript-eslint/explicit-function-return-type`

### 2. Prettier 설정
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### 3. 추천 VS Code 확장프로그램
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (API 테스트)

## 📝 추가 권장사항

### 1. 컴포넌트 문서화
각 컴포넌트에 JSDoc 주석 추가:

```tsx
/**
 * 기본 버튼 컴포넌트
 * @param children - 버튼 내부 텍스트 또는 요소
 * @param variant - 버튼 스타일 변형
 * @param size - 버튼 크기
 * @param onClick - 클릭 이벤트 핸들러
 */
const Button: React.FC<ButtonProps> = ({ ... }) => {
  // ...
}
```

### 2. 에러 바운더리 구현
```tsx
class ErrorBoundary extends React.Component {
  // 에러 바운더리 구현
}
```

### 3. 테스트 코드 작성
- Jest + React Testing Library
- 컴포넌트별 단위 테스트
- 통합 테스트

### 4. 접근성 (a11y) 개선
- ARIA 라벨 추가
- 키보드 네비게이션 지원
- 스크린 리더 호환성

## 🔍 코드 리뷰 체크포인트

- [ ] 컴포넌트명이 명확하고 의미가 있는가?
- [ ] Props 타입이 명확히 정의되어 있는가?
- [ ] 불필요한 리렌더링이 발생하지 않는가?
- [ ] 접근성 요구사항을 충족하는가?
- [ ] 에러 핸들링이 적절히 구현되어 있는가?
- [ ] 코드 중복이 없는가?
- [ ] 컴포넌트 크기가 적절한가? (200줄 이하 권장)
