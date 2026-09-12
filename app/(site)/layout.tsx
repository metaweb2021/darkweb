import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminNavBadge } from "@/components/admin-nav-badge";



export const metadata: Metadata = {
  title: {
    default: "DARKHACK // offensive security training",
    template: "%s // DARKHACK",
  },
  description:
    "A hands-on offensive security & capture-the-flag training range. Break things safely, learn real tradecraft, climb the board.",
  metadataBase: new URL("https://darkhack.example"),
  openGraph: {
    title: "DARKHACK // offensive security training",
    description:
      "A hands-on offensive security & capture-the-flag training range.",
    type: "website",
  },
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="relative sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          <Navbar />
          <div className="hidden md:flex">
            <AdminNavBadge />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
