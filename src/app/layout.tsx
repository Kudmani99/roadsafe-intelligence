import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "RoadSafe Intelligence — GTA Community Road Safety",
  description:
    "Report dangerous driving and road hazards across the Greater Toronto Area. Live incident map, dashboard analytics, and AI-powered safety insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-navy">
              RoadSafe Intelligence
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Smarter road safety through community intelligence · Greater
              Toronto Area
            </p>
            <p className="mt-3 text-xs text-slate-400">
              MVP Demo Prototype · Community Safety Analytics
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
