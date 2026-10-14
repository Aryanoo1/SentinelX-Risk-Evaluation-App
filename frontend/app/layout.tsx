// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "SentinelX",
  description: "Intelligent Risk, Fraud & Financial Experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background text-text min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
