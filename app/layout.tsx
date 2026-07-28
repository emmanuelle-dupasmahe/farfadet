import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import EventBanner from "@/components/EventBanner";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



// 🪛 pour le référencement du site : Ajout du manifest et des icônes Apple
export const metadata: Metadata = {
  title: "Les Farfadets Vertigo - Activités et Séjours",
  description: "Découvrez les activités sportives, de bien-être et les séjours pour enfants proposés par Les Farfadets Vertigo.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png", // Déclare le favicon pour les onglets de navigateur
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Farfadets",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />

        {/* Le bandeau est placé  sous le header rose */}
        <EventBanner />

        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}