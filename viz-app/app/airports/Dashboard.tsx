"use client";
import AirportByCountryPlot from './AirportByCountryPlot';

const Dashboard: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-slate-50">
      <div className="mt-16 mb-32 grid grid-cols-1 gap-8 lg:max-w-5xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <AirportByCountryPlot/>
      </div>
    </main>
  )
}

export default Dashboard;
