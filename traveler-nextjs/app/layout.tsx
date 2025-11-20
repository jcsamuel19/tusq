import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tusq - We find the event. You take the challenge.",
  description: "A modern travel website to discover amazing destinations around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
