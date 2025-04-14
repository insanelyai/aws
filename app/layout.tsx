import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OverClouded - Cloud Solutions & Digital Innovation",
  description: "A showcase of our team's projects and articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/* Navigation */}
        <nav className='bg-white shadow-lg'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex items-center'>
                <Link href='/' className='text-2xl font-bold text-blue-600'>
                  OverClouded
                </Link>
              </div>
              <div className='flex items-center space-x-4'>
                <Link
                  href='/projects'
                  className='text-gray-600 hover:text-blue-600'
                >
                  Projects
                </Link>
                <Link
                  href='/articles'
                  className='text-gray-600 hover:text-blue-600'
                >
                  Articles
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className='bg-gray-800 text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div>
                <h3 className='text-xl font-bold mb-4'>OverClouded</h3>
                <p className='text-gray-400'>
                  Cloud Solutions & Digital Innovation
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
                <ul className='space-y-2'>
                  <li>
                    <Link
                      href='#projects'
                      className='text-gray-400 hover:text-white'
                    >
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#articles'
                      className='text-gray-400 hover:text-white'
                    >
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#team'
                      className='text-gray-400 hover:text-white'
                    >
                      Team
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-4'>Contact</h3>
                <p className='text-gray-400'>Email: contact@overclouded.com</p>
              </div>
            </div>
            <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400'>
              <p>
                &copy; {new Date().getFullYear()} OverClouded. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
