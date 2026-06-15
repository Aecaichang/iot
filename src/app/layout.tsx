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

export const metadata: Metadata = {
  metadataBase: new URL("https://iot-connect.example.com"),
  title: "IoT Connect — เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT",
  description:
    "สื่อการเรียนรู้แบบภาพเคลื่อนไหว อธิบายมาตรฐานการเชื่อมต่ออุปกรณ์ IoT แต่ละประเภท ตั้งแต่ Wi-Fi, Bluetooth, Zigbee, LoRaWAN ไปจนถึงโปรโตคอลข้อมูลอย่าง MQTT",
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
    title: "IoT Connect — เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT",
    description:
      "สื่อการเรียนรู้แบบภาพเคลื่อนไหว อธิบายมาตรฐานการเชื่อมต่ออุปกรณ์ IoT แต่ละประเภท ตั้งแต่ Wi-Fi, Bluetooth, Zigbee, LoRaWAN ไปจนถึงโปรโตคอลข้อมูลอย่าง MQTT",
    url: "https://iot-connect.example.com",
    siteName: "IoT Connect",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IoT Connect — เรียนรู้มาตรฐานการเชื่อมต่ออุปกรณ์ IoT",
    description:
      "สื่อการเรียนรู้แบบภาพเคลื่อนไหว อธิบายมาตรฐานการเชื่อมต่ออุปกรณ์ IoT แต่ละประเภท ตั้งแต่ Wi-Fi, Bluetooth, Zigbee, LoRaWAN ไปจนถึงโปรโตคอลข้อมูลอย่าง MQTT",
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
