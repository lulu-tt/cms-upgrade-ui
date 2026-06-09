# CMS Upgrade UI: Figma Component Map

이 라이브러리는 기존 HTML 시안을 Figma 컴포넌트로 옮기기 쉽도록 React 컴포넌트를 variant 중심으로 나눈 구조입니다.

## Foundations

- Color tokens: `--cms-primary`, `--cms-success`, `--cms-warning`, `--cms-danger`, `--cms-bg`, `--cms-surface`, `--cms-border`
- Typography: `--cms-font-sans`, `--cms-font-mono`
- Radius: `--cms-radius-sm`, `--cms-radius-md`, `--cms-radius-lg`
- Shadow: `--cms-shadow-sm`, `--cms-shadow-md`

## Components

- `AppShell`: sidebar, topbar, content area를 포함한 CMS 기본 프레임
- `Sidebar`: 1차/2차 메뉴, 활성 메뉴 variant
- `Topbar`: breadcrumb와 우측 액션 영역
- `PageHeader`: 화면 제목, 설명, badge, actions
- `Button`: `primary`, `secondary`, `ghost`
- `IconButton`: 정사각 아이콘 액션 버튼
- `Badge`: `blue`, `green`, `amber`, `red`, `gray`
- `StatusBadge`: `normal`, `warning`, `error`, `paused`
- `MetricCard`: KPI 카드, tone variant
- `Panel`: 제목/액션/본문이 있는 콘텐츠 패널
- `Card`: 반복 링크 카드나 일반 정보 카드
- `Field`, `TextInput`, `SelectInput`, `TextArea`: 폼 입력 단위
- `Toggle`, `CheckRow`, `FileDropzone`: 설정 화면 입력 패턴
- `DataTable`: 목록/이력 테이블
- `ProgressBar`: 성능/비율 표시

## Example Screens

- `DashboardExample`: 기존 `dashboard.html`의 대시보드 조합
- `ChatbotDashboardExample`: 기존 `chatbot-dashboard.html`의 KPI/차트 조합
- `ApiRegisterExample`: API 등록/설정 폼 조합

## Figma Naming Recommendation

- `CMS/AppShell`
- `CMS/Sidebar`
- `CMS/Topbar`
- `CMS/PageHeader`
- `CMS/Button`
- `CMS/Badge`
- `CMS/MetricCard`
- `CMS/Panel`
- `CMS/FormField`
- `CMS/DataTable`

Figma variant는 React props와 같은 이름으로 맞추면 개발 전달이 단순해집니다. 예: `Button.variant=primary`, `Badge.tone=green`, `MetricCard.tone=red`.
