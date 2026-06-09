import { Bot, ChartLine, FileText, LayoutDashboard, Monitor, Settings, SlidersHorizontal } from "lucide-react";
import type { SidebarItem } from "../components/Sidebar";

export const cmsMenu: SidebarItem[] = [
  { href: "#", icon: <LayoutDashboard aria-hidden size={17} />, id: "dashboard", label: "대시보드" },
  {
    href: "#",
    icon: <SlidersHorizontal aria-hidden size={17} />,
    id: "operation",
    label: "운영",
    children: [
      { id: "content", label: "웹콘텐츠 관리" },
      { id: "board-basic", label: "게시판 - 일반형(기본)" }
    ]
  },
  {
    href: "#",
    icon: <Monitor aria-hidden size={17} />,
    id: "api-monitor",
    label: "API Monitor",
    children: [
      { id: "api-overview", label: "전체현황" },
      { id: "api-register", label: "API 등록" }
    ]
  },
  {
    href: "#",
    icon: <Bot aria-hidden size={17} />,
    id: "chatbot",
    label: "Chatbot 관리",
    children: [
      { id: "chatbot-dashboard", label: "실시간 통계" },
      { id: "chatbot-settings", label: "챗봇 설정관리" }
    ]
  },
  { href: "#", icon: <FileText aria-hidden size={17} />, id: "logs", label: "로그" },
  { href: "#", icon: <ChartLine aria-hidden size={17} />, id: "stats", label: "통계" },
  { href: "#", icon: <Settings aria-hidden size={17} />, id: "system", label: "시스템" }
];
