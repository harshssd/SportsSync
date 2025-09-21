import Header from "@/components/layout/Header";
// FIX: Import ReactNode to fix 'Cannot find namespace React' error.
import type { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
    </div>
  );
}
