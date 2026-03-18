import type { Metadata } from "next";
import { Sora, DM_Mono } from "next/font/google";
import SessionProvider from "@/components/auth/SessionProvider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const BASE_URL = "https://getvizon.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Vizon — AI-Powered Career Diagnostic for Consulting",
    template: "%s — Vizon",
  },
  description:
    "Find out if you're ready for consulting. Vizon's AI diagnostic evaluates your problem-solving, communication, and analytical skills against real consulting benchmarks.",
  keywords: [
    "consulting diagnostic",
    "career assessment",
    "consulting skills test",
    "McKinsey interview prep",
    "case interview practice",
    "consulting readiness",
    "AI career diagnostic",
    "management consulting",
    "BCG interview",
    "Bain interview",
    "consulting skills assessment",
  ],
  authors: [{ name: "Vizon" }],
  creator: "Vizon",
  publisher: "Vizon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Vizon",
    title: "Vizon — AI-Powered Career Diagnostic for Consulting",
    description:
      "Find out if you're ready for consulting. AI-powered diagnostic that evaluates your skills against real consulting benchmarks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vizon — AI-Powered Career Diagnostic for Consulting",
    description:
      "Find out if you're ready for consulting. AI-powered diagnostic that evaluates your skills against real consulting benchmarks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Vizon",
      url: BASE_URL,
      description:
        "AI-powered career diagnostics for consulting professionals.",
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Vizon",
      publisher: { "@id": `${BASE_URL}/#organization` },
      description:
        "Find out if you're ready for consulting with Vizon's AI-powered career diagnostic.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${sora.variable} ${dmMono.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
