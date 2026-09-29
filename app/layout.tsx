import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import UserProvider from "@/hooks/UserProvider";
import Sidebar from "@/components/Sidebar";
import AnnouncementCard from "@/components/AnnouncementCard";
import Notifications from "@/components/Notifications";
import QProvider from "@/hooks/providers/EventQuery";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const googleSans = Google_Sans({
  variable: "--font-googleSans",
  subsets: ["latin"],
});
const poppins =Poppins({
  variable:"--font-poppins",
  subsets:['latin'],
  weight:['100','200','300','400','500','600','700']
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <ClerkProvider>
      <UserProvider>
        <QProvider>
          <html lang="en">
            <link rel="manifest" href="/manifest.json" />
            <body
              className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} ${googleSans.variable} font-googleSans antialiased`}
            >
              {children}
            </body>
          </html>
        </QProvider>
      </UserProvider>
    </ClerkProvider>
  );
}
