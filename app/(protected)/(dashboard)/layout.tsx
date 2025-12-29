

// app/(protected)/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getCurrentUserWithCart } from "@/api/client";
import { Layout } from "@/components/layout/layout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const token = session.tokenSet.accessToken;

  let user, cart;
  try {
    const data = await getCurrentUserWithCart(token);
    user = data.user;
    cart = data.cart;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    redirect("/error");
  }

  // Extract roles
const roles =
  (session.user?.["https://api.suncore.app/roles"] as string[]) ?? [];

  return (
    <Layout serverUser={user ?? null} serverRoles={roles}>
      {children}
    </Layout>
  );
}