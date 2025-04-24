// src/app/layout.tsx
import type { Metadata } from 'next';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: {
    default: "SillyLink",
    template: "%s | SillyLink"
  },
  description: "Your website's default description for SEO and social sharing.",
  keywords: ["keyword1", "keyword2", "keyword3"],
  authors: [{ name: "Your Name", url: "http://localhost:3000" }],
  themeColor: "#ffffff",
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
    description: "Your website's default description for Twitter",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-accent">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}