import type { Metadata } from "next";

const siteTitle = "Kobe Michael";
const siteDescription = "A portfolio showcasing selected work and projects.";

function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!siteUrl) {
    return new URL("http://localhost:3000");
  }

  const normalizedSiteUrl = siteUrl.startsWith("http")
    ? siteUrl
    : `https://${siteUrl}`;

  return new URL(normalizedSiteUrl);
}

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: "/",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteTitle} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};
