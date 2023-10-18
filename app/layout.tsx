import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GA";
export const metadata: Metadata = {
    title: "Morpheus",
    description: "Your private file converter, take the red pill.",
    applicationName: "Morpheus",
    generator: "Morpheus",
    keywords: [
        "morpheus",
        "file",
        "converter",
        "private",
        "free",
        "online",
        "convert",
        "convertor",
        "audio",
        "video",
        "image",
        "document",
        "ebook",
        "archive",
        "compress",
    ],
    authors: [
        { name: "Akshay Varma", url: "https://av10.tech" },
        { name: "butcanudothis", url: "https://github.com/butcanudothis" },
    ],
    colorScheme: "dark",
    creator: "Akshay Varma",
    publisher: "Akshay Varma",
    formatDetection: {
        email: false,
        telephone: false,
        address: false,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <GoogleAnalytics GA_MEASUREMENT_ID="G-R6CM13Q6Z4" />
        <meta name="google-site-verification" content="TI_-Bmom37qzyM1dbaa5zQipybegYSTg4tb9xMj08r0" />
        <body>
        <Navbar />
        <Toaster />
        <div className="pt-16 min-h-screen lg:pt-18 2xl:pt-22 container max-w-4xl lg:max-w-6xl 2xl:max-w-7xl">
            {children}
        </div>
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-center py-3">
            Made with ❤️ by <a href="https://github.com/butcanudothis" className="underline">Akshay Varma</a>
        </footer>

        </body>
        </html>
    );
}
