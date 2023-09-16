import React, { useEffect, useRef } from 'react';
import * as Tableau from 'tableau-api-js';

interface WorldAirRoutesProps {
  url: string;  // URL of the Tableau visualization you want to embed
}

const WorldAirRoutes: React.FC<WorldAirRoutesProps> = ({ url }) => {
  const vizContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vizContainerRef.current) {
      // Initialize the Tableau visualization
      const vizOptions = {
        hideTabs: true,
        onFirstInteractive: () => {
          console.log("Tableau viz has loaded");
        }
      };

      new Tableau.Viz(vizContainerRef.current, url, vizOptions);
    }
  }, [url]);

  return <div ref={vizContainerRef}></div>;
}

export default WorldAirRoutes;
