import {d3} from '../../lib/d3-lite'
//import {colors} from '../../data/config'

const chartType = {
  scatter: { r: 3, stroke: 0, opacity: 0.5 },
  line:    { r: 3, stroke: 0, opacity: 1 }
}

export default function(els, dataChart, scale, who, colors) {

  // init gs
  let gs =
  d3.select(els.svg)
  .selectAll("g")
  .data(dataChart)

  // update
  gs
  .html("")
  .attr("fill", (d, i) => colors ? colors[i] : false)
  .selectAll("circle")
  .data(d => d)
  .enter().append("circle")
  .attr("cx", d => scale.x(d.x))
  .attr("cy", d => scale.y(d.y))
  .attr("title", d => "(" + d.x+ ", " + d.y + ")")
  // custom on chart type
  .attr("r", chartType[who].r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")

  // new
  gs.enter().append("g")
  .attr("fill", (d, i) => colors ? colors[i] : false)
  .selectAll("circle")
  .data(d => d)
  .enter().append("circle")
  .attr("cx", d => scale.x(d.x)) //date
  .attr("cy", d => scale.y(d.y)) //number
  .attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
  // custom on chart type
  .attr("r", chartType[who].r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")

  // remove
  gs.exit().remove()
}
