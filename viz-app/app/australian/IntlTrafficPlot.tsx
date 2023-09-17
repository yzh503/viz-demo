import React, { useState, useEffect, useRef } from 'react';
import { Datum, BarChart } from './IntlTrafficSVG';

type FetchCallback = (error: Error | null, result?: { intlTraffic: [Datum] }) => void;

const IntlTrafficPlot: React.FC = () => {
  const [data, setData] = useState<Datum[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const fetchData = (callback: FetchCallback): void => {
    const graphqlQuery = {
      query: `
        {
          intlTraffic {
            name
            value
            date
          }
        }
      `
    };
  
    fetch(`/api/australian`, {
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
      if (result && result.intlTraffic) {
        setData(result.intlTraffic);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="group rounded-lg pb-10 pt-5 pl-5 bg-white border mb-5">
      { containerWidth && <BarChart data={data} width={containerWidth} /> }
    </div>
  );  
}

export default IntlTrafficPlot;
