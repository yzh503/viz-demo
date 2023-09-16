import * as d3 from "d3";
import { useRef, useEffect } from "react";

type LineChartProps = {
  data: { date: string, value: number }[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

const LineChart: React.FC<LineChartProps> = ({
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

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => new Date(d.date)) as [Date, Date])
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value) as [number, number])
    .range([height - marginBottom, marginTop]);

  const line = d3.line<{ date: string, value: number }>()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.value));

  useEffect(() => {
    if (gx.current) {
      d3.select(gx.current).call(d3.axisBottom(x));
    }
    if (gy.current) {
      d3.select(gy.current).call(d3.axisLeft(y));
    }
  }, [x, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data) || ''} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(new Date(d.date))} cy={y(d.value)} r="2.5" />
        ))}
      </g>
    </svg>
  );
};

export default LineChart;
