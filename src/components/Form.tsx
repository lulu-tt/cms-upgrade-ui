import type { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  required?: boolean;
}

export function Field({ children, className = "", label, required, ...props }: FieldProps) {
  return (
    <label className={`cms-field ${className}`.trim()} {...props}>
      <span className="cms-label">
        {label} {required ? <span className="cms-required">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`cms-input ${props.className ?? ""}`.trim()} {...props} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`cms-select ${props.className ?? ""}`.trim()} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`cms-textarea ${props.className ?? ""}`.trim()} {...props} />;
}

export function Toggle({ checked, onClick }: { checked?: boolean; onClick?: () => void }) {
  return <button aria-checked={checked} className="cms-toggle" onClick={onClick} role="switch" type="button" />;
}

export function CheckRow({ checked, label }: { checked?: boolean; label: string }) {
  return (
    <label className="cms-check-row">
      <input defaultChecked={checked} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

export function FileDropzone({ hint = "최대 50MB 이하의 파일을 등록할 수 있습니다.", label = "파일을 선택해 주세요." }) {
  return (
    <div className="cms-file-dropzone">
      <strong>{label}</strong>
      <span style={{ fontSize: 11 }}>{hint}</span>
    </div>
  );
}
