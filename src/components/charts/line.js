import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

export default function (els, dataChart, scaleX, scaleY) {

  const line = d3.line()
  .defined(d => d.y !== null)
  .x(d => Math.round(scaleX(d.x)*100)/100)
  .y(d => scaleY(d.y));

  // init
  let svg = d3.select(els.svg)
  .selectAll("path")
  .data(dataChart)

  // update
  svg.attr("d", d => line(d))

  // new
  svg.enter().append("path")
  .attr("fill", "none")
  .attr("stroke", (d, i) => colors[i])
  .attr("stroke-width", "2px")
  .attr("shape-rendering", "auto")
  .attr("stroke-linecap", "round") // or square to render a single point
  .attr("stroke-opacity", .75)
  .attr("d", d => line(d))

  // remove
  svg.exit().remove()
}
