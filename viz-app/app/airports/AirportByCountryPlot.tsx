import React, { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react'
import BarChart from './BarChart';

type Datum = {
  _id: string;
  count: number;
};

type FetchCallback = (error: Error | null, result?: { numberOfAirportsByCountry: Datum[] }) => void;

const AirportByCountryPlot: React.FC = () => {
  const [data, setData] = useState<{ country: string, airports: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = (callback: FetchCallback): void => {
    setIsLoading(true);

    const graphqlQuery = {
      query: `
        {
          numberOfAirportsByCountry(limit: 10) {
            _id,
            count
          }
        }
      `
    };
  
    fetch(`/api/airports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(graphqlQuery)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(result => callback(null, result))
    .catch(err => callback(err));
  };
  

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 100);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData((error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (result && result.numberOfAirportsByCountry) {
        const transformedData = result.numberOfAirportsByCountry.map(datum => ({
          country: datum._id,
          airports: datum.count
        }));
        console.log(transformedData);
        setData(transformedData);
        setIsLoading(true);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="group rounded-lg p-10 bg-white border">
      <h2 className="mb-10 text-3xl font-semibold">Number of Airports</h2>
      { containerWidth && <BarChart data={data} width={containerWidth} /> }
    </div>
  );  
}

export default AirportByCountryPlot;
