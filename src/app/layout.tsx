import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ExamVal | Double-Blind Grading',
  description: 'Double-blind evaluation and reconciliation pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
