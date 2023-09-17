"use client";
import AirportByCountryPlot from './AirportByCountryPlot';
import TopkBusiestAirlines from './TopkBusiestAirlines';
import TopkBusiestCities from './TopkBusiestCities';
import WorldAirRoutes from './WorldAirRoutes';

const Dashboard: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5">
      <div className="grid grid-cols-1 gap-2 lg:max-w-6xl lg:w-full lg:grid-cols-1 lg:grid-rows-1 lg:text-left">
        <h1 className="text-3xl font-semibold mt-5 mb-5">Global Flights</h1>

        <div className="flex justify-between">
          <div className="flex-grow pr-2">
            <h2 className="text-xl font-semibold mb-2">The Busiest Airlines</h2>
            <TopkBusiestAirlines />
          </div>

          <div className="bg-gray-300 w-px h-full self-stretch mx-4"></div> {/* Added margins (mx-4) for spacing */}

          <div className="flex-grow pl-2">
            <h2 className="text-xl font-semibold mb-2">The Busiest Cities</h2>
            <TopkBusiestCities /> {/* Assuming you'll replace this with a different component for cities */}
          </div>
        </div>

        <h2 className="text-xl font-semibold">International Airports by Country</h2>
        <p className="text-xs">Click the bar to advance to the next level. Click on the white area or the x-axis to return.</p>
        <AirportByCountryPlot />

        <h2 className="text-xl font-semibold">World Air Routes</h2>
        <p className="text-xs">Move area by zooming in and out.</p>
        <WorldAirRoutes url="https://public.tableau.com/views/AirlineRoutes_16948663169810/Sheet1?:language=en-US&:display_count=n&:origin=viz_share_link" />
      </div>
    </main>
  )
}

export default Dashboard;
