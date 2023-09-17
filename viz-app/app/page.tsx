"use client";
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      alert('This web app has not been optimised for narrow devices. Please use a wider screen (width > 768px).');
    }
  }, []);

  return (
    <main className="flex flex-col min-h-screen items-start justify-start p-12 bg-white">
      <div className="grid grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-2 lg:text-left mb-16 mt-10">
        <div className="group rounded-lg p-2 bg-white flex flex-col items-center justify-center border">
          <Link href="/global">
            <div className="text-l text-blue-600 m-2 text-grey-600 hover:text-grey-800">Explore Global Data</div>
          </Link>
        </div>
        <div className="group rounded-lg p-2  bg-white flex flex-col items-center justify-center border">
          <Link href="/australian">
            <div className="text-l text-blue-600 m-2 text-grey-600 hover:text-grey-800">Explore Australian Data</div>
          </Link>
        </div>
      </div>

      <div className="mb-5 ml-1">
        <p className="mb-5">
          Welcome to the aviation data analytics platform!
        </p>

        <p className="mb-5">We aim to provide you with insightful visualisation to the aviation data from <a href="https://ourairports.com/data/" className="text-blue-600">ourairports.com</a> and <a href="https://openflights.org" className="text-blue-600">openflights.org</a>.</p>
        
        <p className="mb-5">This app retrieves data from MongoDB and visualises the data using D3.js and Tableau. All data are provided via GraphQL.</p>

        <p className="mb-5">
          <a href="https://github.com/yzh503/viz-demo" className="text-blue-600">Source Code</a> by Simon Yang
        </p>
      </div>
    </main>
  );
}
