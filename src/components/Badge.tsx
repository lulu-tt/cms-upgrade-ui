import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "blue" | "green" | "amber" | "red" | "gray";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, className = "", icon, tone = "gray", ...props }: BadgeProps) {
  return (
    <span className={`cms-badge cms-badge--${tone} ${className}`.trim()} {...props}>
      {icon}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "normal" | "warning" | "error" | "paused" }) {
  const meta = {
    normal: ["정상", "green"],
    warning: ["주의", "amber"],
    error: ["장애", "red"],
    paused: ["중지", "gray"]
  } as const;
  const [label, tone] = meta[status];
  return <Badge tone={tone}>{label}</Badge>;
}
