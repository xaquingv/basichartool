import {d3} from '../../lib/d3-lite'
import {width} from '../../data/config'

const chartType = {
  scatter: { r: 3, stroke: 0, opacity: 0.5 },
  line:    { r: 3, stroke: 0, opacity: 1 }
}

export default function(els, dataChart, scale, who, colors, step, margin) {
  // data
  // TODO: double check render seq
  let r = chartType[who].r
  // responsive r
  if (step === 3) {
    const elSvg = document.querySelector(".js-graph svg")
    const svgWidth = elSvg.getBoundingClientRect().width
    r = Math.round(chartType[who].r*width*10/svgWidth)/10
  }

  margin = margin ? margin : {left: 0, right: 0, top: 0, bottom: 0}
  //console.log("plot", margin)
  
  // init gs
  let gs =
  d3.select(els.svg)
  .selectAll("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .data(dataChart)

  // update
  gs
  .html("")
  .attr("fill", (d, i) => colors ? colors[i] : false)
  .selectAll("circle")
  .data(d => d)
  .enter()
  .append("circle")
  .attr("cx", d => scale.x(d.x))
  .attr("cy", d => scale.y(d.y))
  .attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
  // custom on chart type
  .attr("data-r", d => scale.r ? scale.r(d.r) : r)
  .attr("r", d => scale.r ? scale.r(d.r) : r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")
  .style("cursor", "pointer")
  .append("title")
  .text(d => d.title)

  // new
  gs.enter()
  .append("g")
  .attr("fill", (d, i) => colors ? colors[i] : false)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .selectAll("circle")
  .data(d => d)
  .enter()
  .append("circle")
  .attr("cx", d => scale.x(d.x)) //date
  .attr("cy", d => scale.y(d.y)) //number
  .attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
  // custom on chart type
  .attr("data-r", d => scale.r ? scale.r(d.r) : r)
  .attr("r", d => scale.r ? scale.r(d.r) : r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")

  // remove
  gs.exit().remove()
}
