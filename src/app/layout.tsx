import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InvitationIntro from "@/components/InvitationIntro";
import { siteConfig } from "@/data/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: `${siteConfig.couple.partner1} & ${siteConfig.couple.partner2} — ${siteConfig.weddingDateDisplay}`,
  description: `Join us in ${siteConfig.location} as we celebrate the wedding of ${siteConfig.couple.partner1} and ${siteConfig.couple.partner2}. ${siteConfig.weddingDateDisplay} — formal invitation to follow.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${greatVibes.variable} ${jost.variable} font-body bg-ivory text-charcoal antialiased`}
      >
        <InvitationIntro />
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
