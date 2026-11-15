import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ModalProvider } from "@/context/ModalContext";
import { UIProvider } from "@/context/UIContext";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "ARCH NEW ERA DESIGN – NRBL TECH | Architecture, Construction & Interior Designing",
    template: "%s | ARCH NEW ERA DESIGN (NRBL TECH)",
  },
  description:
    "Your Dream Home, Our Expertise. Thoughtful Design. Stronger Structure. Brighter Lives. Premier Architecture, Construction, Interior Designing & Turnkey Solutions in Shahdara, Delhi by Nidhi Sharma.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* MANDATORY per modern-web-guidance dark-mode: Declare support for both light and dark themes */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-sans antialiased bg-[#F6F7FA] text-[#172033] selection:bg-[#D6B36A] selection:text-[#071A35]">
        <ThemeProvider>
          <UIProvider>
            <ModalProvider>
              {children}
              <ToastProvider />
            </ModalProvider>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
