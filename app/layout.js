import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bulk Vegetable/Fruit Ordering Platform',
  description: 'A platform for bulk ordering of vegetables and fruits',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} layout-body`}>
        <nav className="layout-nav">
          <div className="layout-nav-container">
            <a href="/" className="layout-nav-brand">
              AgroFix
            </a>
            <div className="layout-nav-links">
              <a href="/order/track" className="layout-nav-link">
                Track Order
              </a>
              <a href="/admin/dashboard" className="layout-nav-link">
                Admin Dashboard
              </a>
            </div>
          </div>
        </nav>
        <main className="layout-main container container--padded">{children}</main>
      </body>
    </html>
  );
}