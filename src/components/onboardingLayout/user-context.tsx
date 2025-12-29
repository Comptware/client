"use client";

import { createContext, useContext, ReactNode } from "react";
import { UserProfile } from "@/types";

type UserContextType = {
  user: UserProfile | null;
  roles: string[] | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  user,
  roles,
}: {
  children: ReactNode;
  user: UserProfile | null;
  roles?: string[] | null;
}): JSX.Element => {
  // Safely resolve roles: prefer passed roles → fallback to user.roles → empty array
  const resolvedRoles = roles ?? user?.roles ?? [];

  return (
    <UserContext.Provider value={{ user, roles: resolvedRoles }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};