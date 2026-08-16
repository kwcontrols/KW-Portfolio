import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import "./portal-auth.css";

const GA_MEASUREMENT_ID = "G-76RBFH4SD1";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("x-forwarded-host") ?? incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "KW Portfolio | Automation, Integration & AI";
  const description =
    "The portfolio of KW, an experienced process automation and system integration specialist embracing AI and sharing the journey.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "KW Portfolio | Building smarter systems",
      description: "Process automation, system integration, and a continuously evolving AI journey.",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "KW Portfolio — Building smarter systems. Learning what comes next." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "KW Portfolio | Building smarter systems",
      description: "Process automation, system integration, and a continuously evolving AI journey.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
