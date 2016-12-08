import {d3} from '../../lib/d3-lite'
import {colors, colorBarBackground} from '../../data/config'

const barHeight = 16
const barMarginBottom = 8

const stickHeight = 4
const stickTop = (barHeight - stickHeight) / 2

export function addBarsBackground(el, dataChart, margin) {

  let barBackground =
  d3.select(el)
  .html("")
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .style("margin-bottom", barMarginBottom + "px")
  .style("background-color", colorBarBackground)
  .append("div")
  .attr("class", "group")
  .style("height", barHeight + "px")
  .style("position", "relative")
  // margin used to avoid pixel out of canvas
  // ex. half tick / dot size / custom in case of arrow
  .style("margin", "0 " + margin + "px")
  .selectAll("div")
  .data(d => d)
  .enter()

  return barBackground
}


export function drawBarSticks(el) {

  el.append("div")
  .attr("class", "line")
  .attr("title", d => d.title ? d.title : false)
  .style("width", d => d.width ? d.width + "%" : d.widthCalc)
  .style("height", stickHeight + "px")
  .style("position", "absolute")
  .style("top", stickTop + "px")
  .style("left", d => d.shift ? d.shift + "%" : d.lineLeftCalc)
  .style("background-color", d => d.color ? d.color : colors[6])
}
