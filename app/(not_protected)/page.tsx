
// app/(not_protected)/page.tsx
import { redirect } from "next/navigation";
import { auth0 } from "../../lib/auth0";
import { Header } from "@/components/header/header";
export default async function Home() {
  const session = await auth0.getSession();

  if (session?.user) {
    const roles = session.user?.["https://api.suncore.app/roles"] ?? [];
    // console.log(roles, 'roles from /app/(not_protected)/page.tsx')
    if (roles.includes("ADMIN") || roles.includes("OPERATIONS")) {
      redirect("/ops");
    }
    redirect("/dashboard");  // Normal users
  }

  return (
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/logbg.jpg)` }}>
      <div className="md:py-0 py-10 mx-auto">
        <Header />
        <div className="flex h-screen">
          <div className="flex-1 flex-col flex items-center justify-center p-6">
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center gap-2">

                <h1 className="md:text-6xl text-4xl leading-tight font-caslon text-white">
                  SunCore Digital Client Dashboard
                </h1>
              </div>
              <p className="text-lg text-white">
              Login to view your SunCore performance and historical earnings</p>
              <a
                href="/auth/login"
                className="inline-block mt-4 px-20 py-3 rounded-3xl bg-yellow text-lg font-black hover:bg-yellow transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}