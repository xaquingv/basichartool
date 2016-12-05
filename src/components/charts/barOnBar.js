import {d3} from '../../lib/d3-lite'
import {colorBarBackground} from '../../data/config'

const barHeight = 16
const barMarginBottom = 8

export function drawBarsBackground(els, dataChart, margin) {
  d3.select(els.div)
  .html("")
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .style("height", barHeight + "px")
  .style("margin-bottom", barMarginBottom + "px")
  .style("background-color", colorBarBackground)
  .append("div")
  .attr("class", "group")
  .style("position", "relative")
  // margin used to avoid pixel out of canvas
  // ex. half tick / dot size ...
  .style("margin", "0 " + margin + "px")
  .selectAll("div")
  .data(d =>d)
  .enter()
}
