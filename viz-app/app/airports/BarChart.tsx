import * as d3 from "d3";
import { useRef, useEffect } from "react";

type BarChartProps = {
  data: { country: string, airports: number }[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 200,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) => {
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  const x = d3.scaleBand<string>()
    .domain(data.map(d => d.country))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.airports) as number])
    .nice()
    .range([height - marginBottom, marginTop]);

  useEffect(() => {
    if (gx.current) {
      d3.select(gx.current).call(d3.axisBottom(x));
    }
    if (gy.current) {
      d3.select(gy.current).call(d3.axisLeft(y).ticks(null, "s"));
    }
  }, [x, y, data]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      {data.map((d, i) => (
        <rect
          key={i}
          x={x(d.country) as number}
          y={y(d.airports)}
          width={x.bandwidth()}
          height={height - marginBottom - y(d.airports)}
          fill="steelblue"
        />
      ))}
    </svg>
  );
};

export default BarChart;
