import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookNook",
  description: "Discover and manage your books with BookNook.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="dark flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          style={{
            "--normal-bg": "#41283d",
            "--normal-bg-hover": "#50284b",
            "--normal-border": "#781868",
            "--normal-border-hover": "#781868",
            "--normal-text": "#ffffff",
            "--success-bg": "#41283d",
            "--success-border": "#781868",
            "--success-text": "#ffffff",
            "--info-bg": "#41283d",
            "--info-border": "#781868",
            "--info-text": "#ffffff",
            "--warning-bg": "#41283d",
            "--warning-border": "#781868",
            "--warning-text": "#ffffff",
            "--error-bg": "#41283d",
            "--error-border": "#781868",
            "--error-text": "#ffffff",
          }}
        />
      </body>
    </html>
  );
}
