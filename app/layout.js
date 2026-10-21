import "@fontsource-variable/archivo/wdth.css";
import { Caprasimo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Display face of the IGMA Sunday League site.
const caprasimo = Caprasimo({ weight: "400", subsets: ["latin"], variable: "--font-caprasimo" });

export const metadata = {
  title: "IGMA Saturday – pick your position at La Chopera",
  description:
    "For IGMA Pickup Games players at IE University: pick your position for the Saturday 9 PM 7v7 at La Chopera, El Retiro.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6B0A1F",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={caprasimo.variable}>
      <body>
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
