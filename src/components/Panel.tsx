import type { HTMLAttributes, ReactNode } from "react";

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  actions?: ReactNode;
  title?: ReactNode;
}

export function Panel({ actions, children, className = "", title, ...props }: PanelProps) {
  return (
    <section className={`cms-panel ${className}`.trim()} {...props}>
      {title ? (
        <header className="cms-panel__header">
          <h3 className="cms-panel__title">{title}</h3>
          {actions}
        </header>
      ) : null}
      <div className="cms-panel__body">{children}</div>
    </section>
  );
}
