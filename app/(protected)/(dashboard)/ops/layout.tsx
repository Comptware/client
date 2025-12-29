// app/(protected)/ops/layout.tsx
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");

  // Optional: extra server-side check (middleware already did it)
  const roles = session.user?.["https://api.suncore.app/roles"] ?? [];
  if (!roles.includes("ADMIN") && !roles.includes("OPERATIONS")) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}