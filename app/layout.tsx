import { Mona_Sans } from "next/font/google";
import { Providers } from "@/utils";
import "./globals.css";
import type { Metadata } from "next";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cantina Systems",
  description: "Sistema de gerenciamento de pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${monaSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
