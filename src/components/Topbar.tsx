import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface TopbarProps {
  actions?: ReactNode;
  breadcrumbs: string[];
  leading?: ReactNode;
}

export function Topbar({ actions, breadcrumbs, leading }: TopbarProps) {
  return (
    <header className="cms-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {leading}
        <ol className="cms-breadcrumbs" aria-label="현재 위치">
          {breadcrumbs.map((item, index) => (
            <li className={index === breadcrumbs.length - 1 ? "cms-breadcrumbs__current" : undefined} key={item}>
              {index > 0 ? <ChevronRight aria-hidden size={12} /> : null}
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
      {actions}
    </header>
  );
}
