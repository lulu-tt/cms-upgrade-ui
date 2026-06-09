import type { CSSProperties } from "react";

export function ProgressBar({ color, value }: { color?: string; value: number }) {
  return (
    <div className="cms-progress" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={value}>
      <div className="cms-progress__bar" style={{ "--progress-color": color, width: `${value}%` } as CSSProperties} />
    </div>
  );
}
