import {d3} from '../../lib/d3-lite'
import {colorBarBackground} from '../../data/config'
import {dropColorOnShape} from '../section4Panel/paletteDropColorHack'

const barHeight = 16
const barMarginBottom = 8     //style1
//const barHeightHalf = 8     //style2
//const barMarginBottom = 16  //style2

const stickHeight = 4
const stickTop = (barHeight - stickHeight) / 2

export function addBarsBackground(el, dataChart, marginLeft, marginRight = marginLeft) {

  let barBackground =
  d3.select(el)
  .selectAll(".bars")
  .html("")
  .data(dataChart)
  .style("margin-bottom", barMarginBottom + "px")             //style 1
  .style("background-color", colorBarBackground)              //style 1
//.style("margin-bottom", barMarginBottom + "px")             //style 2
//.style("border-bottom", "1px dotted " + colorBarBackground) //style 2
  .append("div")
  .attr("class", "shape")
  .style("position", "relative")
  .style("height", barHeight + "px")                          //style 1
//.style("height", barHeightHalf + "px")                      //style 2

  // NOTE: margin used to avoid pixel out of canvas
  // ex. half tick / dot size / extra customisation in case of arrow
  // see fixPixelOutOfLayout() in ArrowOnBar.js
  .style("margin-left", marginLeft + "px")
  .style("margin-right", marginRight + "px")

  .selectAll("div")
  .data(d => d)
  .enter()

  return barBackground
}


export function drawBarSticks(el, callByStep, bgColor) {

  el.append("div")
  .attr("class", d => "line c" + (d.color ? d.color.replace("#", "") : "stick") + (callByStep===4 ? " c-d" : ""))
  .attr("title", d => d.title ? d.title : false)
  .style("width", d => d.width ? d.width + "%" : d.widthCalc)
  .style("height", stickHeight + "px")
  .style("position", "absolute")
  .style("top", stickTop + "px")
  .style("left", d => d.shift ? d.shift + "%" : d.lineLeftCalc)
  .style("background-color", d => d.color ? d.color : bgColor)
  .on("click", (d, i) => dropColorOnShape((d.color ? d.color.replace("#", "") : "stick"), d.isEven))
}
