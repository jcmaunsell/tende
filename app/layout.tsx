import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DatadogRum from "@/components/DatadogRum";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <DatadogRum />
        <Nav />
        <main className="flex-1 pt-[88px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
