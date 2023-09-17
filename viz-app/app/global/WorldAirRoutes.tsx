import React from 'react';
import dynamic from 'next/dynamic';

// We dynamically import the TableauComponent, which will handle the tableau library and the Viz initialization
const TableauComponent = dynamic(() => import('./TableauComponent'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

interface WorldAirRoutesProps {
  url: string; // URL of the Tableau visualization you want to embed
}

const WorldAirRoutes: React.FC<WorldAirRoutesProps> = ({ url }) => {
  return (
    <div>
      <TableauComponent url={url} />
    </div>
  );
};

export default WorldAirRoutes;
