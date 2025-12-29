// src/components/onboardingLayout/layout.tsx
import React from "react";
import { UserProvider } from "./user-context";
import { UserProfile } from "@/types";

interface Props {
  children: React.ReactNode;
  serverUser: UserProfile | null;
  serverRoles?: string[] | null;
}

export const Layout = ({ children, serverUser, serverRoles }: Props) => {
  return (
    <UserProvider user={serverUser} roles={serverRoles}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Optional: Add a simple top bar/progress indicator later */}
        {/* <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">SunCore Onboarding</h1>
          </div>
        </header> */}

        <section className="">
          {children}
        </section>

        {/* Optional footer */}
        {/* <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
            © 2025 SunCore Digital. All rights reserved.
          </div>
        </footer> */}
      </div>
    </UserProvider>
  );
};