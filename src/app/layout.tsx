import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import UsernameGuard from "@/components/UsernameGuard";
import { ThemeProvider } from "@/components/ThemeContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-grotesk", 
  weight: ["300","400","500","600","700"] 
});

export const metadata: Metadata = {
  title: "debugr | intelligent problem tracking",
  description: "Premium developer intelligence platform.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05050a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <head>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async></script>
      </head>
      <body className="bg-[#05050a] text-[#f0f0ff] font-sans antialiased overflow-x-hidden">
        <SessionProvider>
          <ThemeProvider>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0c0c18',
                  color: '#a78bfa',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.15)',
                },
              }}
            />
            <UsernameGuard>
              <div className="nn-background" />
              {children}
            </UsernameGuard>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
