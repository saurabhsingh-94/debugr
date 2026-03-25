import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";

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
      <body className="bg-background text-white font-sans selection:bg-accent-cyan/10 selection:text-white antialiased">
        <div className="flex flex-col min-h-screen">
          <TopNavbar />
          <main className="flex-1 p-4 md:p-10 bg-background max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
