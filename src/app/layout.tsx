import type { Metadata, Viewport } from "next";

import "./course.css";
import "./globals.css";

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
    // Safari tab uses classic .ico aggressively and caches the first one it saw (often Vercel).
    // favicon-es.ico is a BMP-based ICO + new URL so Safari refetches instead of keeping the old cache.
    icon: [
      {
        url: "/favicon-es.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon-es.ico", type: "image/x-icon" }],
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
  themeColor: "#070714",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el">
      <head>
        <link rel="icon" href="/favicon-es.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon-es.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
