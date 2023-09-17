"use client";
import IntlTrafficPlot from './IntlTrafficPlot';
import DomesticTrafficPlot from './DomesticTrafficPlot';

const Dashboard: React.FC = () => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5">
      <div className="grid grid-cols-1 gap-2 lg:max-w-6xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <h1 className="text-3xl font-semibold mt-5 mb-5">Australian Flights</h1>
        <h2 className="text-xl font-semibold">International Passengers</h2>
        <p className="text-xs">The number of passengers from 2023 to 2024 are predicted by SARIMA. Drag the slider to change year.</p>
        <IntlTrafficPlot />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:max-w-6xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <h2 className="text-xl font-semibold">Domestic Flight Traffic</h2>
        <p className="text-xs">This diagram shows the total passenger flow from one city to another over the past 10 years. Click view more to select more cities.</p>

        <DomesticTrafficPlot />
      </div>
    </main>
  )
}

export default Dashboard;
