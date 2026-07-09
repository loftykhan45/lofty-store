import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/StoreProvider";
import Header from "@/components/Header";
import Orbs from "@/components/Orbs";
import AnnounceBar from "@/components/AnnounceBar";

export const metadata: Metadata = {
  title: "Lofty Store — Mobile accessories, refined",
  description: "Cases, power banks, cables, screen protection, car mounts and airbuds — one clean aesthetic across your whole setup.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Orbs />
          <div className="page">
            <AnnounceBar />
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
