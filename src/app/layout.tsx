import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.houseplanfiles.com"),
  title: {
    default: "House plan , Architects , contractors and Building material | Houseplanfiles",
    template: "%s",
  },
  description:
    "Find 1000s of readymade house plans , Architects ,contractors ,building material and home decor shops in your city",
  keywords: [
    "readymade house plans india",
    "house plans",
    "floor plans",
    "home design",
    "duplex house plans",
    "3bhk house plan",
    "2bhk house plan",
    "village house plans",
    "vastu house plans",
    "architect india",
    "house design india",
  ],
  authors: [{ name: "HousePlanFiles", url: "https://www.houseplanfiles.com" }],
  creator: "HousePlanFiles",
  publisher: "HousePlanFiles",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.houseplanfiles.com",
    siteName: "HousePlanFiles",
    title: "House plan , Architects , contractors and Building material | Houseplanfiles",
    description:
      "Find 1000s of readymade house plans , Architects ,contractors ,building material and home decor shops in your city",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "HousePlanFiles - Readymade House Plans India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House plan , Architects , contractors and Building material | Houseplanfiles",
    description:
      "Find 1000s of readymade house plans , Architects ,contractors ,building material and home decor shops in your city",
    images: ["/logo1.png"],
    creator: "@files22844",
  },
  alternates: {
    canonical: "https://www.houseplanfiles.com",
  },
  verification: {
    google: "1boqz5_cvkNxWsABlYzA9OW8lXrR_ZttKSxmnT0jsUU",
  },
};

// ✅ LocalBusiness + Organization Schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HousePlanFiles",
  description:
    "India's leading platform for readymade house plans, architectural designs, and construction services.",
  url: "https://www.houseplanfiles.com",
  logo: "https://www.houseplanfiles.com/logo1.png",
  image: "https://www.houseplanfiles.com/logo1.png",
  telephone: "+919755248864",
  email: "houseplansdesignsfile@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/Houseplansndesignfiles",
    "https://www.instagram.com/house_plan_files",
    "https://x.com/files22844",
    "https://www.youtube.com/@houseplansfiles8308",
    "https://pinterest.com/houseplanfiles/",
    "https://www.linkedin.com/company/105681541/",
  ],
  founder: {
    "@type": "Person",
    name: "Himanshu Vyas",
    jobTitle: "Founder & CEO",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "House Plans & Architectural Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Readymade House Plans",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom House Design",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "3D Elevation Design",
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HousePlanFiles",
  url: "https://www.houseplanfiles.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.houseplanfiles.com/house-plans?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon2.ico" type="image/x-icon" />
        <meta name="theme-color" content="#f97316" />

        {/* FIX: preconnect to the two biggest external origins for LCP savings */}
        <link rel="preconnect" href="https://houseplanfiles1.s3.eu-north-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.kraya-ai.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KCFWJDQK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KCFWJDQK');
            `,
          }}
        />

        {/* Google Ads */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=AW-11378419977`}
        />
        <Script
          id="google-ads"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11378419977');
            `,
          }}
        />

        {/* AutoSAAS Universal Lead Tracker */}
        <Script
          id="autosaas-tracker"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const API_KEY = "ws_ayt7qatlve";
                const API_URL = "https://nexaflowbackend.onrender.com/api/leads/capture";

                window.addEventListener(
                  "submit",
                  function (e) {
                    const form = e.target;
                    if (!form) return;

                    const formData = new FormData(form);
                    const data = {};
                    formData.forEach((value, key) => {
                      data[key] = value;
                    });

                    const payload = {
                      apiKey: API_KEY,
                      name:
                        data.name ||
                        data.fullname ||
                        data.fullName ||
                        data.user_name ||
                        "Anonymous Lead",
                      email: data.email || data.user_email || "",
                      phone:
                        data.phone || data.mobile || data.whatsappNumber || data.tel || "",
                      source: window.location.hostname + window.location.pathname,
                      data: data,
                    };

                    if (payload.email || payload.phone || data.message || data.description) {
                      fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                        keepalive: true,
                      })
                        .then((r) => r.json())
                        .then((res) => {
                          console.log("AutoSAAS: Lead synced");
                        })
                        .catch(console.error);
                    }
                  },
                  true
                );
              })();
            `,
          }}
        />

        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
}
