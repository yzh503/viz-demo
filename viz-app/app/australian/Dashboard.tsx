"use client";

import React, { useState } from 'react';
import LineChart from './LineChart';

type DataPoint = {
  date: string;
  value: number;
};

type FetchCallback = (error: Error | null, result?: { data: DataPoint[] }) => void;

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<{ date: string, value: number }[]>([]);

  const fetchData = (query: string, callback: FetchCallback): void => {
    fetch(`/api/sample?query=${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(result => callback(null, result))
      .catch(err => callback(err));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(query, (error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
      if (result && result.data) {
        setData(result.data);
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-slate-50">
      <form onSubmit={handleSubmit} className="mb-8 w-full lg:max-w-3xl flex items-center">
        <input
          type="text"
          className="w-full p-4 rounded-l-lg border-t border-b border-l border-gray-300 focus:outline-none transition-outline"
          placeholder="Enter some text..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-indigo-400 p-4 rounded-r-lg border-t border-b border-r border-indigo-400 hover:bg-indigo-500 focus:outline-none transition-colors">
          ➔
        </button>
      </form>

      {data.length > 0 &&
        <div className="mt-16 mb-32 grid grid-cols-1 gap-8 lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:grid-rows-2 lg:text-left">
          <div className="group rounded-lg p-10 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <h2 className="mb-10 text-3xl font-semibold">Card 1</h2>
            <LineChart data={data} />
          </div>
          <div className="group rounded-lg p-10 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <h2 className="mb-10 text-3xl font-semibold">Card 2</h2>
            <p className="m-0 max-w-[40ch] text-lg text-gray-600">
              Content related to the second card goes here.
            </p>
          </div>
        </div>
      }
    </main>
  )
}

export default Dashboard;
