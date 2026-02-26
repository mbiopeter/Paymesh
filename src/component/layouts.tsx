import React from "react";
import Sidebar from "./sidebar";
import Upbar from "./upbar";
import type { Metadata } from "next";

interface Props {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Paymesh",
    description: "Mpesa intergration system",
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
    },
};

export default function ProtectedLayout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Upbar />
            <div className="flex-1   flex flex-row">
                <Sidebar />
                <main className="flex-1 h-[calc(100vh-5rem)] ml-4 md:ml-0 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}