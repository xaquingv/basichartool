import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

const groupHeight = 24
const barHeightDefault = 16

export function drawPlot(els, dataChart, opt = {}) {
  // NOTE: only bars has dynamic barHeight
  const isBars = opt.barHeight ? true : false
  const barHeight = isBars ? opt.barHeight : barHeightDefault
  const display = isBars ? "block" : "inline-block"
  const marginBottom = isBars ? 1 : 0

  // init gs
  let gs =
  d3.select(els.div)
  .selectAll(".group")
  .data(dataChart)

  // update
  gs
  // TODO: double check
  .html("")
  .selectAll("div")
  .data(d => d.value)
  .enter().append("div")
  .attr("title", d => d.title)
  .style("width", d => d.width + "%")
  .style("height", barHeight + "px")
  .style("background-color", (d, i) => opt.colors ? opt.colors[i] : colors[i])
  // on chart types
  .style("margin-left", d => d.shift ? d.shift + "%" : 0)
  .style("margin-bottom", marginBottom + "px")
  .style("display", display)

  // new
  gs.enter().append("div")
  .attr("class", "group")
  .style("height", groupHeight + "px")
  .selectAll("div")
  .data(d => d.value)
  .enter().append("div")
  .attr("title", d => d.title)
  .style("width", d => d.width + "%")
  .style("height", barHeight + "px")
  .style("background-color", (d, i) => opt.colors ? opt.colors[i] : colors[i])
  // on chart types
  .style("margin-left", d => d.shift ? d.shift + "%" : 0) // if negative numbers accepted
  .style("margin-bottom", marginBottom + "px")
  .style("display", display)

  // remove
  gs.exit().remove()
}
