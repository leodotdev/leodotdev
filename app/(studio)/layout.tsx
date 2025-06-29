import "../globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "leo.dev",
  description: "Web, Software, Product Designer",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
