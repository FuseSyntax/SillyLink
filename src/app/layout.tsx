import type { Metadata, Viewport } from 'next';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: {
    default: "SillyLink",
    template: "%s | SillyLink"
  },
  description: "Create memorable short links with advanced analytics and blockchain-powered security",
  keywords: ["url shortener", "analytics", "sillylink"],
  authors: [{ name: "Your Name", url: "http://localhost:3000" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "SillyLink",
    description: "Create memorable short links with advanced analytics and blockchain-powered security",
    url: "http://localhost:3000",
    siteName: "SillyLink",
    images: [
      {
        url: "/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SillyLink",
    description: "Create memorable short links with advanced analytics and blockchain-powered security",
    images: ["/twitter-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-accent">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}