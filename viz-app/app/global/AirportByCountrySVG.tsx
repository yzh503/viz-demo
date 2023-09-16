import * as d3 from "d3";
import { useRef, useEffect } from "react";

export interface Datum {
  name: string;
  value?: number;
  children?: Datum[];
};


type BarChartProps = {
  data: Datum;
  width?: number;
  height?: number;
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
  marginLeft = 175
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barStep = 20;
  const barPadding = 3 / barStep;
  const duration = 500;
  
  useEffect(() => {
    d3.select(containerRef.current).selectAll("svg").remove();
    console.log(data);
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))
      .eachAfter((d: any) => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)

    const color = d3.scaleOrdinal([true, false], ["lightblue", "#aaa"])

    const calculateHeight = (node: any) => {
      const numBars = node.children ? node.children.length : 1;
      console.log(numBars, barStep, marginTop, marginBottom)
      return numBars * barStep + marginTop + marginBottom;
    };    
    
    const yAxis = (g: any, height: number) => {
      g.attr("class", "y-axis")
       .attr("transform", `translate(${marginLeft + 0.5},0)`);
      
      const line = g.selectAll("line").data([null]); // Use data binding to check if line exists
    
      // Update existing line
      line.attr("y2", height - marginBottom);
    
      // Add line if it doesn't exist
      line.enter().append("line")
        .attr("stroke", "currentColor")
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom);
    };

    const xAxis = (g: any) => g
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 80, "s"))
      .call((g: any) => (g.selection ? g.selection() : g).select(".domain").remove())

    const x = d3.scaleLinear().range([marginLeft, width - marginRight])

    function stagger() {
      let value = 0;
      return (d: any, i: any) => {
        const t = `translate(${x(value) - x(0)},${barStep * i})`;
        value += d.value;
        return t;
      };
    }

    function stack(i: number) {
      let value = 0;
      return (d: any) => {
        const t = `translate(${x(value) - x(0)},${barStep * i})`;
        value += d.value;
        return t;
      };
    }

    function up(svg: any, d: any) {
      if (!d.parent || !svg.selectAll(".exit").empty()) return;

      const height = calculateHeight(d.parent);
      svg.attr("viewBox", [0, 0, width, height])
      svg.attr("height", height);
      svg.select(".y-axis").call((g: any) => yAxis(g, height));
      svg.select(".background").datum(d.parent);

      // Define two sequenced transitions.
      const transition1 = svg.transition().duration(duration);
      const transition2 = transition1.transition();

      // Mark any currently-displayed bars as exiting.
      const exit = svg.selectAll(".enter")
        .attr("class", "exit");

      // Update the x-scale domain.
      const children: Iterable<any> = d.parent.children;
      x.domain([0, d3.max(children, (d: any) => d.value)]);

      // Update the x-axis.
      svg.selectAll(".x-axis").transition(transition1)
        .call(xAxis);

      // Transition exiting bars to the new x-scale.
      exit.selectAll("g").transition(transition1)
        .attr("transform", stagger());

      // Transition exiting bars to the parent’s position.
      exit.selectAll("g").transition(transition2)
        .attr("transform", stack(d.index));

      // Transition exiting rects to the new scale and fade to parent color.
      exit.selectAll("rect").transition(transition1)
        .attr("width", (d: any) => x(d.value) - x(0))
        .attr("fill", color(true));

      // Transition exiting text to fade out.
      // Remove exiting nodes.
      exit.transition(transition2)
        .attr("fill-opacity", 0)
        .remove();

      // Enter the new bars for the clicked-on data's parent.
      const enter = bar(svg, down, d.parent, ".exit")
        .attr("fill-opacity", 0);

      enter.selectAll("g")
        .attr("transform", (d: any, i: number) => `translate(0,${barStep * i})`);

      // Transition entering bars to fade in over the full duration.
      enter.transition(transition2)
        .attr("fill-opacity", 1);

      // Color the bars as appropriate.
      // Exiting nodes will obscure the parent bar, so hide it.
      // Transition entering rects to the new x-scale.
      // When the entering parent rect is done, make it visible!
      enter.selectAll("rect")
        .attr("fill", (d: any) => color(!!d.children))
        .attr("fill-opacity", (p: any) => p === d ? 0 : null)
        .transition(transition2)
        .attr("width", (d: any) => x(d.value) - x(0))
        .on("end", function(this: any, p: any) { d3.select(this).attr("fill-opacity", 1); });
    }

    function down(svg: any, d: any) {
      if (!d.children || d3.active(svg.node())) return;

      const height = calculateHeight(d);
      svg.select(".y-axis").call((g: any) => yAxis(g, height));
      svg.attr("viewBox", [0, 0, width, height])
      svg.attr("height", height);
      svg.select(".background").datum(d);

      

      // Define two sequenced transitions.
      const transition1 = svg.transition().duration(duration);
      const transition2 = transition1.transition();

      // Mark any currently-displayed bars as exiting.
      const exit = svg.selectAll(".enter")
        .attr("class", "exit");

      // Entering nodes immediately obscure the clicked-on bar, so hide it.
      exit.selectAll("rect")
        .attr("fill-opacity", (p: any) => p === d ? 0 : null);

      // Transition exiting bars to fade out.
      exit.transition(transition1)
        .attr("fill-opacity", 0)
        .remove();

      // Enter the new bars for the clicked-on data.
      // Per above, entering bars are immediately visible.
      const enter = bar(svg, down, d, ".y-axis")
        .attr("fill-opacity", 0);

      // Have the text fade-in, even though the bars are visible.
      enter.transition(transition1)
        .attr("fill-opacity", 1);

      // Transition entering bars to their new y-position.
      enter.selectAll("g")
        .attr("transform", stack(d.index))
        .transition(transition1)
        .attr("transform", stagger());

      // Update the x-scale domain.
      const children: Iterable<any> = d.children;
      x.domain([0, d3.max(children, d => d.value)]);

      // Update the x-axis.
      svg.selectAll(".x-axis").transition(transition2)
        .call(xAxis);

      // Transition entering bars to the new x-scale.
      enter.selectAll("g").transition(transition2)
        .attr("transform", (d: any, i: any) => `translate(0,${barStep * i})`);

      // Color the bars as parents; they will fade to children if appropriate.
      enter.selectAll("rect")
        .attr("fill", color(true))
        .attr("fill-opacity", 1)
        .transition(transition2)
        .attr("fill", (d: any) => color(!!d.children))
        .attr("width", (d: any) => x(d.value) - x(0));
    }

    function bar(svg: any, down: any, d: any, selector: any) {
      const g = svg.insert("g", selector)
        .attr("class", "enter")
        .attr("transform", `translate(0,${marginTop + barStep * barPadding})`)
        .attr("text-anchor", "end")
        .style("font", "10px sans-serif");

      const bar = g.selectAll("g")
        .data(d.children)
        .join("g")
        .attr("cursor", (d: any) => !d.children ? null : "pointer")
        .on("click", (event: any, d: any) => down(svg, d));

      bar.append("text")
        .attr("x", marginLeft - 6)
        .attr("y", barStep * (1 - barPadding) / 2)
        .attr("dy", ".35em")
        .text((d: any) => d.data.name);

      bar.append("rect")
        .attr("x", x(0))
        .attr("width", (d: any) => x(d.value) - x(0))
        .attr("height", barStep * (1 - barPadding));

      return g;
    }

    const initialHeight = calculateHeight(root);

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, initialHeight])
      .attr("width", width)
      .attr("height", initialHeight)
      .attr("style", "max-width: 100%; height: auto;");

    x.domain([0, root.value || 0]);

    svg.append("rect")
      .attr("class", "background")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", width)
      .attr("height", initialHeight)
      .attr("cursor", "pointer")
      .on("click", (event, d) => up(svg, d));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call((g: any) => yAxis(g, initialHeight));

    down(svg, root);

    const node: SVGSVGElement | null = svg.node();
    if (containerRef.current && node) {
      containerRef.current.appendChild(node);
    }

  }, [data, width, barPadding, barStep, duration, marginLeft, marginBottom, marginTop, marginRight]);

  return (
    <div ref={containerRef}></div>
  );
};
