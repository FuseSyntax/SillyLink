import type { Metadata, Viewport } from 'next';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: {
    default: "SillyLink",
    template: "%s | SillyLink"
  },
  description: "Create memorable short links with advanced analytics and blockchain-powered security",
  keywords: ["url shortener", "analytics", "sillylink"],
  authors: [{ name: "SillyLink", url: "https://sillylink.netlify.app" }],
  openGraph: {
    title: "SillyLink",
    description: "Create memorable short links with advanced analytics and blockchain-powered security",
    url: "https://sillylink.netlify.app",
    siteName: "SillyLink",
    locale: "en-US",
    type: "website",
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