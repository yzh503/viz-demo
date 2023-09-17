import React, { useEffect, useRef } from 'react';

interface TableauComponentProps {
  url: string; // URL of the Tableau visualization you want to embed
}

const TableauComponent: React.FC<TableauComponentProps> = ({ url }) => {
  const vizContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vizContainerRef.current) {
      // Make sure the tableau library is imported here.
      import('tableau-api-js').then((TableauModule) => {
        // Initialize the Tableau visualization
        const vizOptions = {
          hideTabs: true,
          onFirstInteractive: () => {
            console.log("Tableau viz has loaded");
          },
        };

        new TableauModule.Viz(vizContainerRef.current, url, vizOptions);
      });
    }
  }, [url]);

  return <div ref={vizContainerRef}></div>;
}

export default TableauComponent;
