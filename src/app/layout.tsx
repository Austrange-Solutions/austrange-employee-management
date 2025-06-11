import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Austrange Solutions Employee Portal",
  keywords: [
    "Austrange Solutions",
    "Employee Portal",
    "Employee Management",
    "HR Portal",
    "Human Resources",
    "Employee Dashboard",
    "Workforce Management",
    "Employee Services",
    "Employee Self-Service",
    "Employee Information System",
    "Employee Portal System",
    "Employee Engagement",
    "Employee Experience",
    "Employee Communication",
    "Employee Resources",
    "Employee Benefits",
    "Employee Onboarding",
    "Employee Training",
    "Employee Performance",
    "Employee Development",
    "Employee Recognition",
    "Employee Satisfaction",
    "Employee Retention",
  ],
  authors: [
    {
      name: "Austrange Solutions",
      url: "https://austrangesolutions.com",
    },
    {
      name: "Sahil Mane",
      url: "https://sahilmane.vercel.app",
    },
  ],
  description:
    "Austrange Solutions Employee Portal is a comprehensive platform designed to streamline employee management, enhance communication, and improve overall workforce efficiency. It provides tools for HR management, employee self-service, and performance tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
