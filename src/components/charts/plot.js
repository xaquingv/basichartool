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
  //.classed("d-n", false)
  .selectAll("g")
  .data(dataChart)

  // update
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
  gs.exit().remove()
}



/*let circles =
d3.select(els.circles)
.selectAll("circle")
.data(dataChart)

// update
circles
.attr("cx", d => scaleX(d.date))
.attr("cy", d => scaleY(d.number))

// new
circles
.enter().append("circle")
.attr("cx", d => scaleX(d.date))
.attr("cy", d => scaleY(d.number))
.attr("r", 2.5)
.attr("fill", "#4dc6dd")
.attr("stroke", "white")
.attr("stroke-width", 0.5)

// exit
circles.exit().remove()
*/
