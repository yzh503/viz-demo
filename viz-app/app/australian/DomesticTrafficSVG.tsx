import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import { SankeyChart } from './sankey';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";

interface ChordDiagramProps {
  data: Datum[];
  width: number;
}

export interface Datum {
  source: string;
  target: string;
  value: number;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ data, width }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const allCitiesSet = new Set(data.flatMap(d => [d.source, d.target]));
  const valueMap = new Map<string, number>();

  data.forEach(d => {
    valueMap.set(d.source, (valueMap.get(d.source) || 0) + d.value);
    valueMap.set(d.target, (valueMap.get(d.target) || 0) + d.value);
  });

  const allCities = Array.from(allCitiesSet).sort((a, b) => {
    return (valueMap.get(b) || 0) - (valueMap.get(a) || 0);
  });
  const defaultCities = ["Melbourne", "Sydney", "Adelaide", "Brisbane", "Perth", "Gold Coast"];
  const [selectedCities, setSelectedCities] = useState<string[]>(defaultCities);

  const [showAll, setShowAll] = useState(false);
  const displayedCities = showAll ? allCities : allCities.slice(0, 6);

  const onDataChange = (data: Datum[]) => {
    if (data.length === 0) return;

    if (!containerRef.current) return;

    const nodes = Array.from(
      new Set(data.flatMap(d => [d.source, d.target]))
    ).map(name => ({ name: name, category: name }));

    const svg: any = SankeyChart({
      nodes: nodes,
      links: data
    }, {
      width: width,
      height: 600
    } as any);

    const containerNode = containerRef.current;
    while (containerNode.firstChild) {
      containerNode.firstChild.remove();
    }
    containerNode.appendChild(svg as Node);
  };

  useEffect(() => {
    const filteredData = data.filter(d => selectedCities.includes(d.source) && selectedCities.includes(d.target));
    onDataChange(filteredData);
  }, [selectedCities, data]);

  const handleCheckboxChange = (city: string) => {
    setSelectedCities(prevSelected => {
      if (prevSelected.includes(city)) {
        return prevSelected.filter(c => c !== city);
      } else {
        return [...prevSelected, city];
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-6">
        {displayedCities.map(city => (
          <FormControlLabel
            key={city}
            control={
              <Checkbox
                checked={selectedCities.includes(city)}
                onChange={() => handleCheckboxChange(city)}
                name={city}
              />
            }
            label={city}
          />
        ))}
      </div>
      {!showAll && (
        <div className="flex justify-center">
          <button className="mt-2 text-blue-600" onClick={() => setShowAll(true)}>
            View More
          </button>
        </div>

      )}
      <div ref={containerRef} className="text-xs m-4">
      </div>
    </div>
  );
};
