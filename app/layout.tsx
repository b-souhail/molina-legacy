import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const recoleta = localFont({
  src: [
    {
      path: "../public/assets/fonts/Recoleta/Recoleta-Regular.otf",
      weight: "400",
      style: "normal",
    },

  ],
  variable: "--font-recoleta",
});

export const metadata: Metadata = {
  title: "Molina Legacy",
  description: "Professional clothing brand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${recoleta.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
