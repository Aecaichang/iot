import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";

const thai = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-mono-geist",
  subsets: ["latin"],
});

const siteUrl = "https://iotlearning.aecaichang.com";
const title = "IoT Connect — เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT";
const description =
  "สื่อการเรียนรู้แบบภาพเคลื่อนไหว อธิบายมาตรฐานการเชื่อมต่ออุปกรณ์ IoT แต่ละประเภท ตั้งแต่ Wi-Fi, Bluetooth, Zigbee, LoRaWAN ไปจนถึงโปรโตคอลข้อมูลอย่าง MQTT";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "IoT",
    "Internet of Things",
    "IoT Connect",
    "MQTT",
    "Zigbee",
    "LoRaWAN",
    "Thread",
    "Matter",
    "OCPP",
    "EV Charging",
    "Smart Grid",
    "มาตรฐานการเชื่อมต่อ",
    "เครือข่าย IoT",
    "เรียนรู้ IoT"
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "IoT Connect",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "IoT Connect lesson preview",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${thai.variable} ${mono.variable} h-full`}>
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
