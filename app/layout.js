import { Raleway, Unbounded } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

export const metadata = {
  title: "Catapult",
  description:
    "The hackathon for those who love machine learning hosted by Machine Learning at Purdue (ML@P)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${unbounded.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
