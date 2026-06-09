import { AppShell } from "../components/AppShell";
import { Badge } from "../components/Badge";
import { MetricCard } from "../components/MetricCard";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ProgressBar } from "../components/ProgressBar";
import { cmsMenu } from "./data";

export function ChatbotDashboardExample() {
  return (
    <AppShell sidebar={{ activeId: "chatbot-dashboard", items: cmsMenu }} topbar={{ breadcrumbs: ["Chatbot 관리", "실시간 통계"] }}>
      <PageHeader
        actions={<Badge tone="gray">방금 전 업데이트</Badge>}
        description="실시간 대화량, 사용자 만족도, 성능 지표를 확인합니다."
        title="Chatbot 실시간 통계"
      />
      <div className="cms-grid cms-grid--4">
        <MetricCard label="일일 사용량" sub="+15% 어제 대비" tone="blue" unit="건" value="12,345" />
        <MetricCard label="평균 응답시간" sub="-0.3s 지연 개선" tone="green" unit="초" value="1.2" />
        <MetricCard label="만족도 평가" sub="+0.2 지난주 대비" tone="amber" unit="/5.0" value="4.8" />
        <MetricCard label="에러 발생" sub="-8% 어제 대비" tone="red" unit="건" value="23" />
      </div>
      <div className="cms-grid cms-grid--3">
        <Panel className="cms-grid-span-2" title="실시간 대화량">
          <div className="cms-chart-placeholder">Conversation chart</div>
        </Panel>
        <Panel title="주요 질문 TOP 5">
          {["채용 절차는 어떻게 되나요?", "서류 제출 방법?", "면접 준비 팁?", "합격자 발표 일정?", "연봉 정보?"].map((question, index) => (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }} key={question}>
              <span>{question}</span>
              <Badge tone={index < 2 ? "blue" : "amber"}>{32 - index * 5}%</Badge>
            </div>
          ))}
        </Panel>
      </div>
      <div className="cms-grid cms-grid--3">
        <Panel title="API 응답시간"><MetricCard label="평균" unit="초" value="1.2" /></Panel>
        <Panel title="의도 인식 정확도"><ProgressBar color="var(--cms-purple)" value={94.2} /></Panel>
        <Panel title="폴백 발생률"><ProgressBar color="var(--cms-warning)" value={5.8} /></Panel>
      </div>
    </AppShell>
  );
}
