//app/(protected)/(onboarding)/layout.tsx
'use client'
import { Header } from "@/components/header/header";
import { Layout } from "@/components/onboardingLayout/layout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout serverUser={null} serverRoles={null}>
    <div className="min-h-screen bg-gray-50">
        <Header dark={true} />
      {/* Optional: simple header or progress bar */}
      <main className="">
        {children}
      </main>
    </div>
    </Layout>
  );
}