import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Evently: Your Campus Event Companion",
  description: "Discover, register, and manage campus events effortlessly with Evently. Your ultimate companion for staying connected and engaged in campus life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={` antialiased  md:mx-2 lg:mx-3 xl:mx-4`}
    >
      <div className="md:flex  md:gap-4 w-full">
        <Sidebar />
        {children}
        {/* <Notifications /> */}
      </div>
      <MobileNav />
    </main>
  );
}
