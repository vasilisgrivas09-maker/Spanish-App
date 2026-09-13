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
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
      <body>{children}</body>
    </html>
  );
}
