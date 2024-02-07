import "./globals.css";

import { ActiveStatus } from "./context/ActiveStatus";
import { SessionContext } from "./context/SessionContext";
import { StoreContext } from "./context/StoreContext";
import { ToasterContext } from "./context/ToasterContext";
import { Poppins, Nunito, Roboto } from "next/font/google";

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
  title: "MediChat",
  description: "MediChat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${nunito.variable} ${roboto.variable}`}
    >
      <body className="h-screen">
        <SessionContext>
          <ToasterContext />
          <ActiveStatus />
          <StoreContext>{children}</StoreContext>
        </SessionContext>
      </body>
    </html>
  );
}
