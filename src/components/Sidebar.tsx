import { Clock, LogOut, Settings, UserCog } from "lucide-react";
import type { ReactNode } from "react";

export interface SidebarItem {
  children?: SidebarItem[];
  href?: string;
  icon?: ReactNode;
  id: string;
  label: string;
}

export interface SidebarProps {
  activeId?: string;
  brand?: string;
  items: SidebarItem[];
  logoSrc?: string;
}

function SidebarNode({ activeId, item }: { activeId?: string; item: SidebarItem }) {
  const current = item.id === activeId ? "page" : undefined;
  return (
    <li>
      <a aria-current={current} className="cms-sidebar__item" href={item.href ?? "#"}>
        {item.icon}
        <span>{item.label}</span>
      </a>
      {item.children?.length ? (
        <ul className="cms-sidebar__subnav">
          {item.children.map((child) => (
            <li key={child.id}>
              <a
                aria-current={child.id === activeId ? "page" : undefined}
                className="cms-sidebar__subitem"
                href={child.href ?? "#"}
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Sidebar({ activeId, brand = "관리시스템", items, logoSrc = "img-logo.png" }: SidebarProps) {
  return (
    <aside className="cms-sidebar">
      <div className="cms-sidebar__brand">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img alt="로고" className="cms-sidebar__logo" src={logoSrc} />
          <strong style={{ color: "var(--cms-text)", fontSize: 14 }}>{brand}</strong>
        </div>
        <Settings aria-hidden color="var(--cms-text-subtle)" size={16} />
      </div>
      <div className="cms-sidebar__body">
        <section className="cms-sidebar__section">
          <div className="cms-sidebar__label">메뉴 탐색</div>
          <ul className="cms-sidebar__nav">
            {items.map((item) => (
              <SidebarNode activeId={activeId} item={item} key={item.id} />
            ))}
          </ul>
        </section>
      </div>
      <footer className="cms-sidebar__footer">
        <div className="cms-user-chip">
          <div className="cms-avatar">
            <UserCog aria-hidden size={18} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>홍길동</div>
            <div style={{ color: "var(--cms-text-subtle)", fontSize: 12 }}>시스템관리자</div>
          </div>
          <span className="cms-badge cms-badge--blue">
            <Clock aria-hidden size={12} />
            60:00
          </span>
        </div>
        <div className="cms-grid cms-grid--3" style={{ gap: 8, marginTop: 14 }}>
          <button className="cms-button cms-button--secondary" type="button">연장</button>
          <button className="cms-button cms-button--secondary" type="button">정보수정</button>
          <button className="cms-button cms-button--ghost" type="button">
            <LogOut aria-hidden size={14} />
          </button>
        </div>
      </footer>
    </aside>
  );
}
