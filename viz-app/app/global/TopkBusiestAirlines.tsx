import React, { useState, useEffect } from 'react';

const topk = 3;

interface Airline {
  name: string;
  number_of_routes: number;
}

type FetchCallback = (error: Error | null, result?: { busiestAirlines: [Airline] }) => void;

const TopkBusiestAirlines: React.FC = () => {
  const [data, setData] = useState<Airline[]>([]);

  const fetchData = (callback: FetchCallback): void => {
    const graphqlQuery = {
      query: `
        {
          busiestAirlines(limit: ${topk}) {
            name
            number_of_routes
          }
        }
      `
    };
  
    fetch(`/api/global`, {
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

  useEffect(() => {
    fetchData((error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
      if (result && result.busiestAirlines && result.busiestAirlines.length > 0) {
        setData(result.busiestAirlines);
      }
    });
  }, []);

  return (
    <>
      <div className="flex space-x-3 mb-5">
        {data.map((airline, index) => (
          <div key={index} className="w-1/3 bg-white p-4 rounded border hover:bg-sky-100">
            <div className="text-l font-bold mb-2">{airline.name}</div>
            <div className="text-sm text-gray-600">ROUTES: {airline.number_of_routes}</div>
          </div>
        ))}
      </div>
    </>
  );  
}

export default TopkBusiestAirlines;
