import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // 1. On importe ton menu ici

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. On met à jour les métadonnées pour le référencement du site
export const metadata: Metadata = {
  title: "Les Farfadets Vertigo",
  description: "Association Multi-sports, sports-adaptés et bien-être.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr" // 3. On passe la langue en français au lieu de "en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header /> {/* 4. On place le Header juste avant le contenu de la page */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}