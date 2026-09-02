import type { Metadata, Viewport } from "next";
import { Doppio_One } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('coms-ai-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

const doppioOne = Doppio_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-doppio",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COMS.AI — Cebu Outage Monitoring & Intelligence System",
  description:
    "AI-powered outage awareness, mapping, location intelligence, and preparedness for Cebu, Philippines.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030a17",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={doppioOne.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-bg-0 text-text-primary antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
