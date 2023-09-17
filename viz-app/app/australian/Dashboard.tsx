"use client";
import IntlTrafficPlot from './IntlTrafficPlot';
import DomesticTrafficPlot from './DomesticTrafficPlot';

const Dashboard: React.FC = () => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="grid grid-cols-1 gap-2 lg:max-w-6xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <h1 className="text-3xl font-semibold mt-5 mb-5">Australian Flights</h1>
        <h2 className="text-xl font-semibold">International Passengers</h2>
        <p className="text-xs">*The number of passengers from 2023 to 2024 are predicted.</p>
        <IntlTrafficPlot />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:max-w-6xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <h1 className="text-3xl font-semibold mt-5 mb-5">Australian Flights</h1>
        <h2 className="text-xl font-semibold">Domestic Passengers</h2>
        <DomesticTrafficPlot />
      </div>
    </main>
  )
}

export default Dashboard;
