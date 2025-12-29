// src/components/layout.layout.tsx
"use client";

import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { UserProvider } from "./user-context";
import { UserProfile } from "@/types";
interface Props {
  children: React.ReactNode;
  serverUser: UserProfile | null;
  serverRoles?: string[] | null;
}

export const Layout = ({ children, serverUser, serverRoles }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <UserProvider user={serverUser} roles={serverRoles}>
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      <section className='flex h-screen overflow-hidden'>
        <NavbarWrapper />
        
        <SidebarWrapper />
        <section id="dashboard-content" className="z-1 px-8 pb-8 mt-[225px] flex-1 overflow-y-auto w-full">
          {children}
        </section>
      </section>
    </SidebarContext.Provider>
    </UserProvider>
  );
};