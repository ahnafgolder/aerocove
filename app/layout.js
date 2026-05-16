import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  title: "Aerocove BD - Premium Phone Cases",
  description: "Modern, stylish, and protective phone cases in Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} flex flex-col min-h-screen`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
