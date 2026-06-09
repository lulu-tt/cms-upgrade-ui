import type { ReactNode } from "react";

export interface PageHeaderProps {
  actions?: ReactNode;
  badge?: ReactNode;
  description?: string;
  title: string;
}

export function PageHeader({ actions, badge, description, title }: PageHeaderProps) {
  return (
    <div className="cms-page-header">
      <div>
        <h1 className="cms-page-header__title">
          {title} {badge}
        </h1>
        {description ? <p className="cms-page-header__description">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
