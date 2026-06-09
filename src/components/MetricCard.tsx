import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

const metricColors = {
  blue: "var(--cms-primary)",
  green: "var(--cms-success)",
  amber: "var(--cms-warning)",
  red: "var(--cms-danger)"
};

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  sub?: ReactNode;
  tone?: keyof typeof metricColors;
  unit?: string;
  value: ReactNode;
}

export function MetricCard({ className = "", label, sub, tone = "blue", unit, value, style, ...props }: MetricCardProps) {
  return (
    <div
      className={`cms-metric-card ${className}`.trim()}
      style={{ "--metric-color": metricColors[tone], ...style } as CSSProperties}
      {...props}
    >
      <p className="cms-metric-card__label">{label}</p>
      <p className="cms-metric-card__value">
        {value}
        {unit ? <span className="cms-metric-card__unit"> {unit}</span> : null}
      </p>
      {sub ? <div className="cms-metric-card__sub">{sub}</div> : null}
    </div>
  );
}
