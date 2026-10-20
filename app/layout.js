import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "IGMA Saturday – pick your position at La Chopera",
  description:
    "For IGMA Sunday League players at IE University: pick your position for the Saturday 9 PM 7v7 at La Chopera, El Retiro.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2F3EF",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
