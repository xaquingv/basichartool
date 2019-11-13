import {d3} from '../../lib/d3-lite'
import {isHighlight, dropColorToHighlight} from '../section3Edit/paletteDropColorHack'

export default function(els, dataChart, opt = {}) {
  const isStack = opt.id.indexOf("Stack") > -1
  
  // HACK: for highlight event
  const isOneColor = isHighlight(opt.callByStep)
  if (isOneColor) { dataChart.map((d, i) => {d.value[0].index = i; return d}) }

  d3.select(els.svg)
  .html("")
  // group
  .selectAll(".group")
  .data(dataChart)
  .enter().append("g")
  .attr("class", "group")
  .attr("transform", d => {if (d.transform) return d.transform})
  .attr("fill", d => d.color ? d.color : false)
  .selectAll("rect")
  // cols
  .data(d => d.value)
  .enter().append("rect")
  .attr("x", d => d.group)
  .attr("y", d => d.shift)
  .attr("width", opt.width)
  .attr("height", d => d.length)
  // col styles on chart type
  .attr("fill", (d, i) => !isStack ? (d.color ? d.color : opt.colors[i]) : false)
  // HACK: color highlight
  .attr("class", d => isOneColor ? "c-d c"+d.index : "")
  .on("click", (d, i) => { if (isOneColor) {dropColorToHighlight(d.index, "fill")} })
  // title tooltip
  .append("title")
  .text(d => d.title)
}


/*/ init gs
let gs =
d3.select(this.refs.svg)
.selectAll("g")
.data(dataChart)

// update
gs
// TODO: double check
.html("")
.attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
.selectAll("rect")
.data(d => d.value)
.enter().append("rect")
.attr("x", (d, i) => scaleX1(i))
.attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
.attr("width", scaleX1.bandwidth())
.attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
.attr("fill", (d, i) => d ? colors[i] : "transparent")
//.attr("title", d => "(" + d.date + ", " + d.number + ")")

// new
gs.enter().append("g")
.attr("class", "group")
.attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
.selectAll("rect")
.data(d => d.value)
.enter().append("rect")
.attr("x", (d, i) => scaleX1(i))
.attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
.attr("width", scaleX1.bandwidth())
.attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
.attr("fill", (d, i) => d ? colors[i] : "transparent")
//.attr("title", d => "(" + d.date + ", " + d.number + ")")

// remove
gs.exit().remove()*/
