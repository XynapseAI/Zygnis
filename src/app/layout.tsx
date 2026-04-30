import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { Navigation } from "../components/Navigation";
import AuthProvider from "./AuthProvider";
import Web3Provider from "./Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Zygnis | Legendary Tap-to-Earn',
  description: 'Tap to earn ZYG and collect legendary duel cards on Base.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Zygnis',
    description: 'Legendary Duelist Tap-to-Earn on Base',
    url: 'https://zygnis.vercel.app/',
    siteName: 'Zygnis',
    images: [
      {
        url: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'base:app_id': '69f22b6b60934e840dedaaed',
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
      button: {
        title: 'Play Zygnis',
        action: {
          type: 'launch_miniapp',
          name: 'Zygnis',
          url: 'https://zygnis.vercel.app/',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Web3Provider>
            <div className="w-full min-h-screen bg-yugi-dark text-white font-pixel relative overflow-hidden shadow-2xl">
              {children}
              <Navigation />
            </div>
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  );
}