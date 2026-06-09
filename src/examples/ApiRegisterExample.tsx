import { Save, WandSparkles, X } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { CheckRow, Field, FileDropzone, SelectInput, TextArea, TextInput } from "../components/Form";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { cmsMenu } from "./data";

export function ApiRegisterExample() {
  return (
    <AppShell
      sidebar={{ activeId: "api-register", items: cmsMenu }}
      topbar={{
        actions: (
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<WandSparkles size={14} />} variant="ghost">AI 에이전트</Button>
            <Button icon={<X size={14} />}>취소</Button>
            <Button icon={<Save size={14} />} variant="primary">저장</Button>
          </div>
        ),
        breadcrumbs: ["사이트별 운영관리", "한국고용정보원-국문", "API 등록"]
      }}
    >
      <PageHeader description="연계 기관, 인증, 모니터링 조건을 등록합니다." title="신규 API 등록" />
      <Panel title="기본 정보">
        <div className="cms-form-grid">
          <Field label="연계 기관명" required><TextInput placeholder="예) 행정안전부" /></Field>
          <Field label="API 명칭" required><TextInput placeholder="예) 주민등록 진위확인" /></Field>
          <Field label="연계 유형" required>
            <SelectInput><option>REST API</option><option>SOAP / XML</option><option>GraphQL</option></SelectInput>
          </Field>
          <Field label="HTTP 메서드">
            <SelectInput><option>GET</option><option>POST</option><option>PUT</option></SelectInput>
          </Field>
        </div>
      </Panel>
      <Panel title="인증 및 헬스체크">
        <div className="cms-form-grid">
          <Field label="인증 방식" required>
            <SelectInput><option>API Key</option><option>OAuth2</option><option>Mutual TLS</option></SelectInput>
          </Field>
          <Field label="Endpoint URL" required><TextInput placeholder="https://api.example.go.kr/v1/endpoint" /></Field>
        </div>
        <div style={{ height: 12 }} />
        <Field label="헬스체크 파라미터"><TextArea placeholder='{"action":"health","version":"1.0"}' /></Field>
      </Panel>
      <Panel title="알림 설정">
        <div className="cms-form-section">
          <CheckRow checked label="장애 발생 시 즉시 알림" />
          <CheckRow checked label="SLA 위반 시 알림" />
          <CheckRow checked label="복구 시 정상화 알림" />
          <FileDropzone label="인증서 또는 명세 파일 업로드" />
        </div>
      </Panel>
    </AppShell>
  );
}
