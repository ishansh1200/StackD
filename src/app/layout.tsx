import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ComponentHub",
  description: "UI component discovery platform aggregating top design libraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground relative min-h-screen overflow-x-hidden`}>
        {/* Subtle mesh gradient background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background -z-10 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
