"use client";

import * as React from "react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMainAdmin } from "@/components/dashboard/admin/nav-main-admin";
import { NavSecondary } from "@/components/nav-secondary";
import { NavDocuments } from "@/components/nav-documents";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  Newspaper,
  Users,
  FolderTree,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Quản lý bài viết",
      url: "/quan-ly-bai-viet",
      icon: <Newspaper />,
    },
    {
      title: "Quản lý tài khoản",
      url: "/quan-ly-tai-khoan",
      icon: <Users />,
    },
    {
      title: "Quản lý danh mục",
      url: "/quan-ly-danh-muc",
      icon: <FolderTree />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Quản lý thủ tục hành chính",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Quản lý hồ sơ",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Cập nhật trạng thái",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};
export function SidebarAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <img
                  src="/Logo_TPCaoLanh.svg"
                  alt="logo"
                  width={30}
                  height={30}
                />
                <span className="text-xl font-bold">Phường Cao Lãnh</span>
              </a>
            </SidebarMenuButton>
            <div className="text-sm text-muted-foreground ">
              <p>Quản lý hệ thống</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainAdmin items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
