// app/(protected)/layout.tsx — FINAL VERSION
export default async function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fully trust middleware — no Auth0 session check here
  return <>{children}</>;
}