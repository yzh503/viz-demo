import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { SankeyChart } from './sankey';

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

  useEffect(() => {
    if (data.length === 0) return;

    if (!containerRef.current) return;  
    const theFormat = `${d3.format(",.1~f")} TWh`;
    const svg: any = SankeyChart({
      nodes: undefined, links: data
    }, {
      nodeGroup: (d: any) => d.id.split(/\W/)[0],
      width: width,
      height: 600
    } as any);
    
    const containerNode = containerRef.current;
    while (containerNode.firstChild) {
      containerNode.firstChild.remove();
    }
    containerNode.appendChild(svg as Node);
    
  }, [data, width]);

  return (
    <div ref={containerRef} className="text-xs">
    </div>
  );
};
