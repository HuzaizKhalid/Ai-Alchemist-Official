import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ErrorBoundary } from "@/components/error-boundary";
import { ClientLayout } from "@/components/client-layout";
import "./globals.css";
import Image from "next/image";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { Spotlight } from "@/components/ui/spotlight-new";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ProviderWrapper from "@/lib/ProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alchemist Ai",
  icons: {
    icon: "/favicon.ico", // use .ico, .png, or .svg
  },
  description:
    "Track the environmental impact of your AI queries and choose the most energy-efficient models.",
  keywords: [
    "AI",
    "sustainability",
    "carbon footprint",
    "LLM",
    "environmental impact",
  ],
  authors: [{ name: "Alchemist-Ai Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Alchemist Ai - Sustainable AI Search",
    description:
      "Track the environmental impact of your AI queries and choose the most energy-efficient models.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alchemist Ai - Sustainable AI Search",
    description:
      "Track the environmental impact of your AI queries and choose the most energy-efficient models.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} relative min-h-screen`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              // style={{ backgroundImage: "url('/bg.jpg')" }}
            >
              {/* <div className="absolute inset-0 bg-black opacity-80"></div> */}
            </div>

            {/* <AuthProvider> */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <ErrorBoundary>
                <main className="flex-1  relative overflow-hidden">
                  {/* <BackgroundBeams /> */}
                  <ProviderWrapper>{children}</ProviderWrapper>
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    expand={false}
                    duration={4000}
                    className="z-[9999]"
                    toastOptions={{
                      className: "z-[9999]",
                      style: {
                        zIndex: 9999,
                      },
                    }}
                  />
                </main>
              </ErrorBoundary>
            </div>
            {/* </AuthProvider> */}
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
