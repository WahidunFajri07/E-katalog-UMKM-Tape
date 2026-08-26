import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E-Katalog UMKM Tape — Desa Bakung Kidul",
    template: "%s | E-Katalog Tape Bakung Kidul",
  },
  description:
    "Katalog digital produk tape dari UMKM Desa Bakung Kidul, Kecamatan Jamblang, Kabupaten Cirebon. Temukan berbagai varian tape khas Cirebon langsung dari produsennya.",
  keywords: [
    "tape",
    "tape ketan",
    "tape singkong",
    "UMKM",
    "Bakung Kidul",
    "Cirebon",
    "Jamblang",
    "katalog",
    "makanan khas",
  ],
  authors: [{ name: "KKM UMC Kelompok 32" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "E-Katalog Tape Bakung Kidul",
    title: "E-Katalog UMKM Tape — Desa Bakung Kidul",
    description:
      "Temukan berbagai varian tape khas Cirebon dari UMKM Desa Bakung Kidul.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
