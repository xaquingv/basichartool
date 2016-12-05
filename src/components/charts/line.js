import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

export default function (els, dataChart, scaleX, scaleY) {

  const line = d3.line()
  .defined(d => d.number !== null)
  .x(d => Math.round(scaleX(d.date)*100)/100)
  .y(d => scaleY(d.number));

  // init
  let svg = d3.select(els.svg)
  .selectAll("path")
  .data(dataChart)

  // update
  svg.attr("d", d => line(d))

  // new
  svg.enter().append("path")
  .attr("fill", "none")
  // TODO: color from cfg ...
  .attr("stroke", (d, i) => colors[i])
  .attr("stroke-width", "2px")
  .attr("shape-rendering", "auto")
  .attr("stroke-linecap", "round") // or square to render a single point
  .attr("stroke-opacity", .75)
  .attr("d", d => line(d))

  // remove
  svg.exit().remove()
}



/*d3.select(els.path)
.datum(dataChart)
.attr("fill", "none")
.attr("stroke", "#4dc6dd") // c-1: blue light
.attr("stroke-width", 2)
.attr("shape-rendering", "auto")
.attr("stroke-linecap", "square") // or round to render a single point
.attr("d", line)
*/
