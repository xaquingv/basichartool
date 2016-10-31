import {d3} from '../../lib/d3-lite'

const colors = [
    "#4dc6dd",  // blue light
    "#005789",  // blue dark
    "#fcdd03",  // yellow
    "#ff9b0b",  // orange light
    "#ea6911",  // orange dark
    "#dfdfdf",  // grey 5
    "#bdbdbd",  // grey 3
    "#808080",  // grey 1.5
    "#aad801",  // green
    "#000000"   // custom color
];

export function drawLine(els, dataChart, scaleX, scaleY) {

  const line = d3.line()
  .defined(d => d.number)
  .x(d => Math.round(scaleX(d.date)*100)/100)
  .y(d => scaleY(d.number));

  // init
  let svg = d3.select(els.svg)
  //.classed("d-n", false)
  .selectAll("path")
  .data(dataChart)

  // update
  svg
  .attr("d", d => line(d))

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
