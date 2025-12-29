import { Header } from "@/components/header/header";

    export default async function ProtectedLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <>
          <main>
            <Header dark={true} />
            {children}
          </main>
        </>
      );
    }