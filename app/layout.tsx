import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "AI Pipeline Intel",
  description: "Telecom sales intelligence: signals → accounts → action.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          {children}
        </div>
      </body>
    </html>
  );
}
