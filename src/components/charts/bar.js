import {d3} from '../../lib/d3-lite'
import {colors, colorBarBackground} from '../../data/config'

const rowHeight = 24
const barHeightDefault = 16

export default function (els, dataChart, opt = {}) {

  // NOTE: only bars has dynamic barHeight
  const barCountInGroup = dataChart[0].value.length
  const isBars = barCountInGroup > 1 ? true : false
  const barHeight = opt.barHeight || barHeightDefault
  const barMarginBottom = isBars ? 1 : 0
  const groupHeight = opt.barHeight ? (barHeight + barMarginBottom) * barCountInGroup : barHeightDefault
  const groupMarginBottom = rowHeight - groupHeight

  d3.select(els.div)
  .html("")
  // group
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .attr("class", "group")
  .style("height", groupHeight + "px")
  .style("margin-bottom", groupMarginBottom + "px")
  .style("background-color", opt.hasGroupBgColor ? colorBarBackground : false)
  // bars
  .selectAll("div")
  .data(d => d.value)
  .enter().append("div")
  .attr("class", "bar")
  .attr("title", d => d.title)
  .style("width", d => d.width + "%")
  // bar styles on chart type
  .style("height", barHeight + "px")
  .style("background-color", (d, i) => d.color ? d.color : colors[i])
  .style("margin-left", d => d.shift ? d.shift + "%" : false) // accept negative number
  .style("margin-bottom", barMarginBottom + "px")
  .style("display", opt.display ? opt.display : false)


  // TODO: value is 0 vs. null
  // NOTE: check and fix if any width is less than 0.5 pixel which is not displayed except value is 0
  // check
  const widths = dataChart
  .map(group => group.value.map(bar => Math.round(bar.width*300)/100).find(width => width < 0.5))
  .filter(width => width !== undefined)

  const tooSmall = widths.length > 0
  if (tooSmall) { console.warn("one of bar widths is too small") }
  // fix ...
}
