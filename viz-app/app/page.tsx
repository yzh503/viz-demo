import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-12 bg-white">
      <div className="grid grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-2 lg:grid-rows-2 lg:text-left">
        
        <div className="group rounded-lg p-10 shadow-lg bg-white hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
          <Link href="/x">
            <div className="text-2xl m-16 text-grey-600 hover:text-grey-800">Explore Twitter</div>
          </Link>
        </div>
        
        <div className="group rounded-lg p-10 shadow-lg bg-white hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
          <Link href="/flights">
            <div className="text-2xl m-16 text-grey-600 hover:text-grey-800">Explore Flights</div>
          </Link>
        </div>

      </div>
    </main>
  );
}
