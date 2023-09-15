'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="col-start-1 col-end-2 bg-white p-4 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-serif mb-6">Airport Viz</h1>
      <nav>
        <ul className="space-y-4">
          <li className={`text-black hover:text-gray-500 px-4 py-2 rounded transition duration-300 ease-in-out ${pathname === '/airports' ? 'bg-gray-200' : ''} rounded-md`}>
            <Link href="/airports">Airports Data</Link>
          </li>
          <li className={`text-black hover:text-gray-500 px-4 py-2 rounded transition duration-300 ease-in-out ${pathname === '/about' ? 'bg-gray-200' : ''} rounded-md`}>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}