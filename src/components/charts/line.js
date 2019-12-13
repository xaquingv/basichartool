import { d3 } from '../../lib/d3-lite'
import { colors } from '../../data/config';

export default function (els, dataChart, scale) {

  const line = d3.line()
    .defined(d => d.y !== null)
    .x(d => Math.round(scale.x(d.x) * 100) / 100)
    .y(d => scale.y(d.y));

  // init
  let svg = d3.select(els.svg)
    .selectAll("path")
    .data(dataChart)

  // new
  svg.enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke-width", "2px")
    .attr("shape-rendering", "auto")
    .attr("stroke-linecap", "round") // or square to render a single point
    .attr("stroke-opacity", .75)
    // update
    .merge(svg)
    .attr("stroke", d => d.color ? d.color : colors[6])
    .attr("d", d => line(d.line))

  // remove
  svg.exit().remove()
}
