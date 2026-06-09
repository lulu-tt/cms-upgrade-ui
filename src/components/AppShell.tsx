import type { ReactNode } from "react";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { Topbar, type TopbarProps } from "./Topbar";

export interface AppShellProps {
  children: ReactNode;
  sidebar: SidebarProps;
  topbar: TopbarProps;
}

export function AppShell({ children, sidebar, topbar }: AppShellProps) {
  return (
    <div className="cms-ui cms-app-shell">
      <Sidebar {...sidebar} />
      <div className="cms-main">
        <Topbar {...topbar} />
        <main className="cms-content">
          <div className="cms-content-stack">{children}</div>
        </main>
      </div>
    </div>
  );
}
