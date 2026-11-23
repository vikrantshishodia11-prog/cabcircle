import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SahYatri — Airport Cab Sharing & Fare Split',
  description:
    'Find verified co-travellers on the same airport route, lock crew seats before landing, and split cab fares transparently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F6F8F5] text-[#111814]">{children}</body>
    </html>
  );
}