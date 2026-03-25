import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/ui/Header/header";
import Footer from "@/components/ui/Footer/footer";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Phường Cao Lãnh",
  description: "Trang web quảng bá Phường Cao Lãnh",
  icons: {
    icon: "/Logo_TPCaoLanh.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
        <Header />

        <main className="mx-auto w-full flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
