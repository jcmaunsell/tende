import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DatadogRum from "@/components/DatadogRum";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Tende — plant-based beauty",
  description: "Plant-based hair + body care, handcrafted by an organic chemist.",
  openGraph: {
    title: "Tende",
    description: "Plant-based beauty, rooted in care.",
    url: "https://tende.care",
    siteName: "Tende",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const bannerEnabled = settings?.shippingBannerEnabled ?? true;
  const bannerText = settings?.shippingBannerText ?? "Free U.S. shipping on orders over $55 — no code needed";

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <DatadogRum />
        <Nav bannerEnabled={bannerEnabled} bannerText={bannerText} />
        <main className={`flex-1 ${bannerEnabled ? "pt-[88px]" : "pt-14"}`}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
