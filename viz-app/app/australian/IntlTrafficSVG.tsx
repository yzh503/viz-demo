import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import Slider from '@mui/material/Slider';
export interface Datum {
  name: string;
  value: string;
  date: number;
};

type RankData = {
  name: string;
  value: number;
  rank?: number;
};

type RollupData = [Date, Map<string, string>];

type Keyframe = [Date, RankData[]];

type BarChartProps = {
  data: Datum[];
  width?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};


export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  marginTop = 30,
  marginRight = 30,
  marginBottom = 0,
  marginLeft = 100
}) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [numberOfFrames, setNumberOfFrames] = useState(1);
  const [frameToYear, setFrameToYear] = useState<{ [key: number]: number }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const duration = 1;
  const n = 8; // top 10 cities
  const k = 10;
  const barSize = 50;
  const height = marginTop + barSize * n + marginBottom;
  
  useEffect(() => {
    d3.group(data, d => d.name)

    const names = new Set(data.map((d: Datum) => d.name))
    const datevalues: RollupData[] = Array.from(
      d3.rollup(data,
        ([d]: Datum[]) => d.value,
        (d: Datum) => new Date(d.date),
        (d: Datum) => d.name)
    )
      .map(([date, dataMap]: [Date, Map<string, string>]) => [date, dataMap] as RollupData)
      .sort(([a], [b]) => d3.ascending(a, b));
      
    function rank(value: (name: string) => number): RankData[] {
      const data: RankData[] = Array.from(names, name => ({ name, value: value(name) }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }


    const keyframes: Keyframe[] = [];
    let ka: any, a: any, kb: any, b: any;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
      for (let i = 0; i < k; ++i) {
        const t = i / k;
        keyframes.push([
          new Date(ka * (1 - t) + kb * t),
          rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
        ]);
      }
    }
    keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
    setNumberOfFrames(keyframes.length);

    const frameToYear: { [key: number]: number } = {};
    keyframes.forEach((keyframe, index) => {
      frameToYear[index] = keyframe[0].getFullYear();
    });
    setFrameToYear(frameToYear);

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name);
    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))

    const x = d3.scaleLinear([0, 1], [marginLeft, width - marginRight])
    const y = d3.scaleBand()
      .domain(d3.range(n + 1) as any)
      .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
      .padding(0.1);



    function bars(svg: any) {
      // Define a color scale
      const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

      let bar = svg.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("rect");

      return ([date, data]: [Date, any], transition: any) => {
        // Set the domain of the color scale based on the data names
        colorScale.domain(data.map((d: any) => d.name));

        bar = bar
          .data(data.slice(0, n), (d: any) => d.name)
          .join(
            (enter: any) => enter.append("rect")
              // Use the color scale to set the fill color based on the bar's name
              .attr("fill", (d: any) => colorScale(d.name))
              .attr("height", y.bandwidth())
              .attr("x", x(0))
              .attr("y", (d: any) => y((prev.get(d) || d).rank))
              .attr("width", (d: any) => x((prev.get(d) || d).value) - x(0)),
            (update: any) => update,
            (exit: any) => exit.transition(transition).remove()
              .attr("y", (d: any) => y((next.get(d) || d).rank))
              .attr("width", (d: any) => x((next.get(d) || d).value) - x(0))
          )
          .call((bar: any) => bar.transition(transition)
            .attr("y", (d: any) => y(d.rank))
            .attr("width", (d: any) => x(d.value) - x(0)));
      }
    }


    const formatNumber = d3.format(",d");

    function textTween(a: number, b: number): (t: number) => void {
      const i = d3.interpolateNumber(a, b);
      return function (this: any, t: number): void {
        this.textContent = formatNumber(i(t));
      };
    }

    function labels(svg: any) {
      let label = svg.append("g")
        .style("font", "12px var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .selectAll("text");

      return ([date, data]: [Date, any], transition: any) => label = label
        .data(data.slice(0, n), (d: any) => d.name)
        .join(
          (enter: any) => enter.append("text")
            .attr("transform", (d: any) => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
            .attr("y", y.bandwidth() / 2)
            .attr("x", -6)
            .attr("dy", "-0.25em")
            .text((d: any) => d.name)
            .call((text: any) => text.append("tspan")
              .attr("fill-opacity", 0.7)
              .attr("font-weight", "normal")
              .attr("x", -6)
              .attr("dy", "1.15em")),
          (update: any) => update,
          (exit: any) => exit.transition(transition).remove()
            .attr("transform", (d: any) => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
            .call((g: any) => g.select("tspan").tween("text", (d: any) => textTween(d.value, (next.get(d) || d).value)))
        )
        .call((bar: any) => bar.transition(transition)
          .attr("transform", (d: any) => `translate(${x(d.value)},${y(d.rank)})`)
          .call((g: any) => g.select("tspan").tween("text", (d: any) => textTween((prev.get(d) || d).value, d.value))))
    }

    function axis(svg: any) {
      const g = svg.append("g")
        .attr("transform", `translate(0,${marginTop})`);

      const axis = d3.axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_: any, transition: any) => {
        g.transition(transition).call(axis);
        g.select(".tick:first-of-type text").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
        g.select(".domain").remove();
      };
    }

    const formatDate = d3.utcFormat("%Y");

    function ticker(svg: any) {
      const now = svg.append("text")
        .style("font", `bold ${barSize}px var(--sans-serif)`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", marginTop + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(keyframes.length > 0 && !isNaN(keyframes[0][0].getTime()) ? formatDate(keyframes[0][0]) : "");

      return ([date]: any, transition: any) => {
        transition.end().then(() => now.text(formatDate(date)));
      };
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    const runTransition = async (currentFrame: number) => {

      const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // if keyframes is undefined
      if (keyframes[0][1].length === 0) {
        return;
      }
      const keyframe = keyframes[currentFrame];

      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      await transition.end();

    }

    runTransition(currentFrame);

  }, [data, width, marginLeft, marginBottom, marginTop, marginRight, currentFrame]);


  return (
    <>
    <div ref={containerRef} className="pl-28 pr-28">
      <Slider
          className="w-1/2"
          size="small"
          defaultValue={1}
          step={1}
          min={1}
          marks={false}
          max={numberOfFrames-1}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${frameToYear[value]}`}
          value={currentFrame}
          onChange={(event, newValue) => {
            setCurrentFrame(newValue as number);
          }}
        />
    </div>
    <div ref={containerRef} className="text-xs">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
    </>
    
  );
};
