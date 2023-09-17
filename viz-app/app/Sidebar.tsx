'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPlane, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
  }, []);

  if (isLoading) {
    return (<></>);
  }

  return (
    <div className="col-start-1 col-end-2 bg-white p-4 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-serif mb-6"><a href="/">Aviation Viz</a></h1>
      <nav>
        <ul className="space-y-4">
          <li className={`text-black hover:text-gray-500 px-10 py-2 rounded transition duration-300 ease-in-out ${pathname === '/global' ? 'bg-gray-200' : ''} rounded-md`}>
            <Link href="/global"><FontAwesomeIcon icon={faGlobe} className="mr-2" /> Global</Link>
          </li>
          <li className={`text-black hover:text-gray-500 px-10 py-2 rounded transition duration-300 ease-in-out ${pathname === '/australian' ? 'bg-gray-200' : ''} rounded-md`}>
            <Link href="/australian"><FontAwesomeIcon icon={faPlane} className="mr-2" /> Australian</Link>
          </li>
          <li className={`text-black hover:text-gray-500 px-10 py-2 rounded transition duration-300 ease-in-out ${pathname === '/about' ? 'bg-gray-200' : ''} rounded-md`}>
            <Link href="/about"><FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}