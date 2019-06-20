import {d3} from '../../lib/d3-lite'
import {colorBarBackground, width} from '../../data/config'
import {isHighlight, dropColorToHighlight} from '../section4Panel/paletteDropColorHack'

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

  // HACK: for events
  //const cc = clickcancel()
  const isAnnotate = opt.callByStep === 3 && barHeight === barHeightDefault
  const isOneColor = isHighlight(opt.callByStep)
  if (isOneColor || isAnnotate) { dataChart.map((d, i) => d.value.map(dv => dv.index = i)) }

  // bar group
  d3.select(els.div)
  .selectAll(".bars")
  .html("")
  .data(dataChart)
  .style("height", groupHeight + "px")
  .style("margin-bottom", groupMarginBottom + "px")
  .style("background-color", opt.hasGroupBgColor ? colorBarBackground : false)
  // bar
  .selectAll(".bar")
  .data(d => d.value)
  .enter().append("div")
  .attr("class", (d, i) =>
    "bar" +
    (isAnnotate ? " f-bar b"+d.index+i : "") +
    (isOneColor ? " c-d c"+d.index : "")
  )
  .attr("title", d => d.title)
  .style("width", d => d.width + "%")
  // bar styles on chart type
  .style("height", barHeight + "px")
  .style("background-color", (d, i) => d.color ? d.color : opt.colors[i])
  .style("margin-left", d => d.shift ? d.shift + "%" : false) // accept negative number
  .style("margin-bottom", barMarginBottom + "px")
  .style("display", opt.display ? opt.display : false)
  //.call(cc)
  // HACK: color highlight
  //cc
  .on("dblclick", (d, i) => {
    if (isOneColor) {
      dropColorToHighlight(d.index, "backgroundColor")
    }
    if (isAnnotate) {
      const el = document.querySelector(".bar.b"+d.index+i)
      el.blur()
    }
  })
  // HACK: annotation
  //cc
  .on("click", (d, i) => { if (isAnnotate) {
    const el = document.querySelector(".bar.b"+d.index+i)
    el.setAttribute("contenteditable", true)
    el.addEventListener("keydown", onEnter)
    el.focus()
  }})
  .on("blur", (d, i) => { if (isAnnotate) {
    const el = document.querySelector(".bar.b"+d.index+i)
    el.setAttribute("contenteditable", false)
    el.removeEventListener("keydown", onEnter)
    el.innerHTML = el.textContent
  }})


  // TODO: value is 0 vs. null
  // NOTE: check and fix if any width is less than 0.5 pixel which is not displayed except value is 0
  // check
  const widths = dataChart
  .map(group => group.value.map(bar => Math.round(bar.width*width)/100).find(width => width < 0.5))
  .filter(width => width !== undefined)

  const tooSmall = widths.length > 0
  if (tooSmall) { console.warn("one of bar widths is too small") }
  // fix ...
}


// event
function onEnter(e) {
  //console.log("key", e.key)
  if (e.key === "Enter") {
    e.preventDefault()
    e.stopPropagation()
    e.target.blur()
  }
}
