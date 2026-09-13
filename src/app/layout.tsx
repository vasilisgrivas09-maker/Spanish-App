import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import "./course.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Español Course",
  description:
    "Το προσωπικό σου μάθημα Ισπανικών — λεξιλόγιο, quizzes, διάλογοι και προφορική εξάσκηση.",
  applicationName: "Español Course",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Español Course",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Español Course",
    description:
      "Το προσωπικό σου μάθημα Ισπανικών — λεξιλόγιο, quizzes, διάλογοι και προφορική εξάσκηση.",
    type: "website",
    locale: "el_GR",
    siteName: "Español Course",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "Español Course",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Español Course",
    description:
      "Το προσωπικό σου μάθημα Ισπανικών — λεξιλόγιο, quizzes, διάλογοι και προφορική εξάσκηση.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070714" },
    { media: "(prefers-color-scheme: light)", color: "#f5f6fa" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBootstrap = `(function(){try{var s=localStorage.getItem("spanish_settings_v1");var theme="system";if(s){var p=JSON.parse(s);if(p&&(p.theme==="dark"||p.theme==="light"||p.theme==="system"))theme=p.theme;}var dark=window.matchMedia("(prefers-color-scheme: dark)").matches;var resolved=theme==="light"?"light":theme==="dark"?"dark":(dark?"dark":"light");document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="el" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={inter.className}>
        <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
      </body>
    </html>
  );
}
