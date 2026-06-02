import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className="antialiased bg-image-[url('/bg.webp')]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
