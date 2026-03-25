import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DEBUGR | Terminal Curator",
  description: "Real-time AI problem intelligence system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-white font-sans selection:bg-white/10 selection:text-white">
        <div className="flex flex-col min-h-screen relative overflow-x-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto pt-32 px-6 lg:px-10 pb-20 relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
