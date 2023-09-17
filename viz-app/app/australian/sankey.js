// https://observablehq.com/@mariodelgadosr/sankey-diagram-with-draggable-nodes@827
import * as d3Sankey from "d3-sankey";
import * as d3 from "d3";

let uidCounter = 0;
function generateUID(prefix = "link") {
    uidCounter += 1;
    return `${prefix}-${uidCounter}`;
}

export function SankeyChart(data, {
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
}) {
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const edgeColor = "path";
  const align = "justify";
  const colorfn = d3.scaleOrdinal(d3.schemeCategory10);
  const color = d => colorfn(d.category === undefined ? d.name : d.category);
  const formatfn = d3.format(",.0f");
  const format = data.units ? d => `${formatfn(d)} ${data.units}` : formatfn;

  const sankey = d3Sankey
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3Sankey[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5]
    ]);

  let dataNodes = data.nodes.map((d) => Object.assign({}, d));
  let dataLinks = data.links.map((d) => Object.assign({}, d));

  let group = sankey({ nodes: dataNodes, links: dataLinks });

  const nodes = group.nodes;
  const links = group.links;

  const nodeWidth = nodes[0].x1 - nodes[0].x0;
  const node = svg
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  node
    .append("rect")
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", color)
    .attr("stroke", "#000")
    .append("title")
    .text((d) => `${d.name}\n${format(d.value)}`);

  node
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("x", (d) => (d.x0 < width / 2 ? 6 + (d.x1 - d.x0) : -6)) // +/- 6 pixels relative to container
    .attr("y", (d) => (d.y1 - d.y0) / 2) // middle of node
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);

  node
    .attr("cursor", "move")
    .call(d3.drag().on("start", dragStart).on("drag", dragMove));

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  if (edgeColor === "path") {
    const gradient = link
      .append("linearGradient")
      .attr("id", (d) => {
        d.uid = generateUID(); 
        return d.uid;
      })
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", (d) => d.source.x1)
      .attr("x2", (d) => d.target.x0);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", (d) => color(d.source));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", (d) => color(d.target));
  } //if

  link
    .append("path")
    .attr("class", "link")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", (d) =>{
      return edgeColor === "none"
        ? "#aaa"
        : edgeColor === "path"
        ? `url(#${d.uid})`
        : edgeColor === "input"
        ? color(d.source)
        : color(d.target);}
    )
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  function dragStart(event, d) {
    d.__x = event.x;
    d.__y = event.y;
    d.__x0 = d.x0;
    d.__y0 = d.y0;
    d.__x1 = d.x1;
    d.__y1 = d.y1;
  } //dragStart

  function dragMove(event, d) {
    d3.select(this).attr("transform", function (d) {
      const dx = event.x - d.__x;
      const dy = event.y - d.__y;
      d.x0 = d.__x0 + dx;
      d.x1 = d.__x1 + dx;
      d.y0 = d.__y0 + dy;
      d.y1 = d.__y1 + dy;

      if (d.x0 < 0) {
        d.x0 = 0;
        d.x1 = nodeWidth;
      } 

      if (d.x1 > width) {
        d.x0 = width - nodeWidth;
        d.x1 = width;
      } 

      if (d.y0 < 0) {
        d.y0 = 0;
        d.y1 = d.__y1 - d.__y0;
      } 

      if (d.y1 > height) {
        d.y0 = height - (d.__y1 - d.__y0);
        d.y1 = height;
      } 

      return `translate(${d.x0}, ${d.y0})`;
    }); 

    sankey.update({ nodes, links });
    link.selectAll(".link").attr("d", d3Sankey.sankeyLinkHorizontal());
  } 

  return svg.node();
}