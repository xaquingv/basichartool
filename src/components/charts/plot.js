import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

const chartType = {
  scatter: { r: 3, stroke: 0, opacity: 0.5 },
  line:    { r: 3, stroke: 0, opacity: 1 }
}

export default function(els, dataChart, scaleX, scaleY, who) {

  // init gs
  let gs =
  d3.select(els.svg)
  .selectAll("g")
  .data(dataChart)

  // new
  gs.enter().append("g")
  .style("fill", (d, i) => colors[i])
  .selectAll("circle")
  .data(d => d)
  .enter().append("circle")
  .attr("cx", d => scaleX(d.x)) //date
  .attr("cy", d => scaleY(d.y)) //number
  .style("cursor", "pointer")
  // custom on chart type
  .attr("r", chartType[who].r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")
  // title tooltip
  .append("title")
  .text(d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
}


/*/ update
gs
// TODO: double check
.html("")
.selectAll("circle")
.data(d => d)
.enter().append("circle")
.attr("cx", d => scaleX(d.x))
.attr("cy", d => scaleY(d.y))
.attr("title", d => "(" + d.x+ ", " + d.y + ")")
// custom on chart type
.attr("r", chartType[who].r)
.attr("fill", d => d.color ? d.color : false)
.attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
.attr("stroke-width", chartType[who].stroke)
.attr("stroke", "white")

// new
gs.enter().append("g")
.style("fill", (d, i) => colors[i])
.selectAll("circle")
.data(d => d)
.enter().append("circle")
.attr("cx", d => scaleX(d.x)) //date
.attr("cy", d => scaleY(d.y)) //number
.attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
// custom on chart type
.attr("r", chartType[who].r)
.attr("fill", d => d.color ? d.color : false)
.attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
.attr("stroke-width", chartType[who].stroke)
.attr("stroke", "white")

// remove
gs.exit().remove()*/
