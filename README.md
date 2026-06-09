# CMS Upgrade UI

기존 CMS upgrade HTML 시안을 React 컴포넌트 라이브러리 형태로 정리한 작업물입니다.

## 구성

- `src/components`: Figma 컴포넌트와 1:1로 대응하기 쉬운 공통 컴포넌트
- `src/examples`: 기존 화면을 컴포넌트 조합으로 재구성한 예제
- `src/styles/cms-upgrade.css`: 디자인 토큰과 컴포넌트 스타일
- `docs/figma-component-map.md`: Figma 작업용 컴포넌트 매핑 문서

## 사용 예

```tsx
import { AppShell, MetricCard, PageHeader } from "cms-upgrade-ui";
import "cms-upgrade-ui/src/styles/cms-upgrade.css";

export function Screen() {
  return (
    <AppShell sidebar={{ items: [] }} topbar={{ breadcrumbs: ["관리시스템"] }}>
      <PageHeader title="대시보드" description="주요 지표를 확인합니다." />
      <MetricCard label="일일 사용량" value="12,345" unit="건" tone="blue" />
    </AppShell>
  );
}
```

## 빌드

```bash
npm install
npm run build
```

현재 저장소에는 기존 정적 HTML도 그대로 남겨두었습니다.
