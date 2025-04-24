// src/app/layout-client.tsx
"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper";
export default function LayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <SessionWrapper>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </SessionWrapper>
        </div>
    );
}