
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M10.15 4.5a8.77 8.77 0 0 0-4.65 4.65" />
            <path d="M13.85 19.5a8.77 8.77 0 0 0 4.65-4.65" />
            <path d="M4.5 13.85a8.77 8.77 0 0 0 4.65 4.65" />
            <path d="M19.5 10.15a8.77 8.77 0 0 0-4.65-4.65" />
            <path d="M12 12a4 4 0 0 0-4 4" />
            <path d="M12 12a4 4 0 0 1 4 4" />
            <path d="m12 12 4-4" />
          </svg>
          <span className="sr-only">SportsSync</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Link href="/signup" prefetch={false}>
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Sync Your Game, Amplify Your Fame
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SportsSync is the ultimate tool for athletes and sports creators to manage their social media presence, starting with Instagram.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    prefetch={false}
                  >
                     <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
               <img
                src="https://picsum.photos/seed/sportssync/600/600"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 SportsSync. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
          <Link href="/data-deletion" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Data Deletion
          </Link>
        </nav>
      </footer>
    </div>
  );
}
