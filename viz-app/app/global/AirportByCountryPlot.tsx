"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Datum, BarChart } from './AirportByCountrySVG';

type FetchCallback = (error: Error | null, result?: { hierarchicalAirports: [Datum] }) => void;

const AirportByCountryPlot: React.FC = () => {
  const [data, setData] = useState<Datum>({name: "airports", children: []});
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const fetchData = (callback: FetchCallback): void => {
    const graphqlQuery = {
      query: `
        {
          hierarchicalAirports {
            name
            children {
              name
              children {
                name
                children {
                  name
                  value
                  children {
                    name
                    value
                  }
                }
              }
            }
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
  

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 100);
    }
  };


  useEffect(() => {
    fetchData((error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
      if (result && result.hierarchicalAirports) {
        setData(result.hierarchicalAirports[0]);
      }
    });
    handleResize();
  }, []);

  return (
    <div ref={containerRef} className="group rounded-lg pb-10 pt-5 pl-5 bg-white border mb-5">
      { containerWidth && <BarChart data={data} width={containerWidth} /> }
    </div>
  );  
}

export default AirportByCountryPlot;
