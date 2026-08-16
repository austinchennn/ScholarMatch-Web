import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsPageView } from "./AnalyticsPageView";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "ScholarMatch — Find your next research collaborator";
const DESCRIPTION =
  "ScholarMatch matches researchers and students by shared research interests, with a mutual-match feed, private messaging, and a board for open collaboration opportunities.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s — ScholarMatch",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "ScholarMatch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Suspense fallback={null}>
            <AnalyticsPageView />
          </Suspense>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
