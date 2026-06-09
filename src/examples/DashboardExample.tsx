import { RefreshCw, Star } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Badge } from "../components/Badge";
import { Button, IconButton } from "../components/Button";
import { Card } from "../components/Card";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ProgressBar } from "../components/ProgressBar";
import { cmsMenu } from "./data";

export function DashboardExample() {
  return (
    <AppShell
      sidebar={{ activeId: "dashboard", items: cmsMenu }}
      topbar={{
        actions: (
          <div style={{ display: "flex", gap: 8 }}>
            <IconButton title="즐겨찾기"><Star size={16} /></IconButton>
            <IconButton title="새로고침"><RefreshCw size={16} /></IconButton>
          </div>
        ),
        breadcrumbs: ["관리시스템", "대시보드"]
      }}
    >
      <PageHeader
        badge={<Badge tone="blue">현황 분석</Badge>}
        description="방문자 및 주요 운영 지표를 한눈에 모니터링합니다."
        title="대시보드"
      />
      <div className="cms-grid cms-grid--3">
        <Card><strong>웹 콘텐츠 관리</strong><p className="cms-page-header__description">웹 에디터로 사이트 콘텐츠를 수정합니다.</p></Card>
        <Card><strong>네이비스 이용안내</strong><p className="cms-page-header__description">가이드와 고객 지원 센터를 확인합니다.</p></Card>
        <Card><strong>방문자 통계 요약 보고서</strong><p className="cms-page-header__description">접속 데이터 기반 보고서를 제공합니다.</p></Card>
      </div>
      <div className="cms-grid cms-grid--4">
        <MetricCard label="오늘 방문자" tone="blue" unit="명" value="1,248" />
        <MetricCard label="페이지 뷰" tone="amber" unit="회" value="4,892" />
        <MetricCard label="운영 메뉴" tone="green" unit="개" value="42" />
        <MetricCard label="대기 작업" tone="red" unit="건" value="7" />
      </div>
      <div className="cms-grid cms-grid--2">
        <Panel title="방문자 / 페이지 뷰 추이">
          <div className="cms-chart-placeholder">Chart area</div>
        </Panel>
        <Panel title="디바이스별 접속 통계">
          <div style={{ display: "grid", gap: 16 }}>
            <ProgressBar value={68.5} />
            <ProgressBar color="var(--cms-success)" value={27.3} />
            <ProgressBar color="var(--cms-warning)" value={4.2} />
          </div>
        </Panel>
      </div>
      <Button variant="primary">보고서 생성</Button>
    </AppShell>
  );
}
