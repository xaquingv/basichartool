import {d3} from '../../lib/d3-lite'
import {width} from '../../data/config'

const chartType = {
  scatter: { r: 3, stroke: 0, opacity: 0.5 },
  line:    { r: 3, stroke: 0, opacity: 1 }
}

export default function(els, dataChart, scale, who, colors, step) {
  // data
  // TODO: double check render seq
  let r = chartType[who].r
  // responsive r
  if (step === 4) {
    const elSvg = document.querySelector("#section4 svg")
    const svgWidth = elSvg.getBoundingClientRect().width
    r = Math.round(chartType[who].r*width*10/svgWidth)/10
  }

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
  .attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
  // custom on chart type
  .attr("r", d => {
    console.log(scale.r(d.r));
    return scale.r ? scale.r(d.r) : r;
  })
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")

  // new
  console.log(scale);
  gs.enter()
  .append("g")
  .attr("fill", (d, i) => colors ? colors[i] : false)
  .selectAll("circle")
  .data(d => d)
  .enter().append("circle")
  .attr("cx", d => scale.x(d.x)) //date
  .attr("cy", d => scale.y(d.y)) //number
  .attr("title", d => d.title ? d.title : "(" + d.x + ", " + d.y + ")")
  // custom on chart type
  .attr("r", d => scale.r ? scale.r(d.r) : r)
  .attr("fill", d => d.color ? d.color : false)
  .attr("fill-opacity", d => d.y !== null ? chartType[who].opacity : 0)
  .attr("stroke-width", chartType[who].stroke)
  .attr("stroke", "white")

  // remove
  gs.exit().remove()
}
