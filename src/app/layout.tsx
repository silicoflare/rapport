import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { montserrat } from "@/utils/fonts";
import { Toaster } from "@/components/ui/sonner";
import Session from "./Session";

export const metadata: Metadata = {
  title: "Rapport",
  description: "End-to-end encrypted messaging app",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <Session session={session}>
          <div className="flex flex-col w-screen h-screen items-center">
            <Navbar />
            <Toaster richColors={true} />
            {children}
          </div>
        </Session>
      </body>
    </html>
  );
}
