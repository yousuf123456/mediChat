import "./globals.css";

import { ClerkContext } from "./context/ClerkContext";
import { ToasterContext } from "./context/ToasterContext";
import { Poppins, Nunito, Roboto } from "next/font/google";
import { StrictMode } from "react";

const nunito = Nunito({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-nunito",
});

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "ChatVibe",
  description: "ChatVibe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>

    <html
      lang="en"
      className={`${poppins.variable} ${nunito.variable} ${roboto.variable}`}
    >
      <body className="h-screen">
        <ToasterContext />
       
        <ClerkContext>{children}</ClerkContext>
      </body>
    </html>
    </StrictMode>
  );
}
