import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {appendChartData} from '../../actions'
import {dropColorOnShape} from '../section4Panel/paletteDropColorHack'
import {addBarsBackground, drawBarSticks} from './onBar'
import ComponentRow from './BarBase'

const barHeight = 16
const headSize = 12
const headTop = (barHeight - headSize) / 2
const tickShift = 5

const mapStateToProps = (state) => ({
  selectedChartId: state.chartId,
  data: state.dataChart,
  axis: state.dataEditable.axis
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale, margins) => dispatch(appendChartData(keys, scale, margins))
})


// TODO: still res issue to sort out
class ArrowOnBar extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    if (callByStep === 4) { this.margin = data.margin }
    //console.log("render:", callByStep)
    //console.log("[this]", this.margin)
    //console.log("[data]", data.margin)

    // step 3
    const setChartData = () => {
      if (callByStep === 3) {
        const key = data.keys
        const legendKeys = ["Change from " + key[0] + " to " + key[1]]
        onSelect(legendKeys, this.scale, this.margin/*{left: margin, right: margin}*/)
      }
    }

    // step 4
    const isLabel = callByStep === 4
    return (
      <div className="canvas" ref="div" onClick={setChartData}>
        {data.string1Col.map((label, i) =>
        <ComponentRow isLabel={isLabel} label={label} key={i}/>
        )}
      </div>
    )
  }

  renderChart() {

    /* data */
    const {data, axis, callByStep} = this.props
    const domain = callByStep === 4 && axis ? axis.x.range : d3.extent(data.numbers)
    // using axis.x.range due to editable range @setup2, section 4

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(domain)
    .range([0, 100])

    // chart
    const dataRows = data.numberRows.map((nums, i) => ({
      value: nums,
      width: Math.abs(this.scale.x(nums[1]) - this.scale.x(nums[0])),
      shift: this.scale.x(Math.min(nums[0], nums[1]))
    }))

    this.dataChart = dataRows.map(d => {
      const nums = d.value
      return [{
        title: nums[0] === nums[1] ? nums[0] : Math.min(nums[0], nums[1]) + " - " + Math.max(nums[0], nums[1]),
        widthCalc: "calc(" + d.width + "% - " + headSize/2 + "px)",
        ...getArrowData(d)
      }]
    })


    /* draw */
    this.drawChart()

    /* validate special */
    // NOTE: fix pixel out of bar issue (range [0, 3px])
    // due to extrem even values at two ends
    // which causes faulty layout on iOS mobile
    // TODO: fix render and update issue
    this.fixPixelOutOfLayoutOnce()
  }

  drawChart() {
    // group and background bars
    // margin 0 at two ends due to un-pre-calculat-able pixel shift
    // patch fix in fixPixelOutOfLayout()
    let callBy = this.props.callByStep
    let margin = this.props.data.margin ? this.margin : {left: 0, right: 0}
    let gs = addBarsBackground(this.refs.div, this.dataChart, margin.left, margin.right)

    // arrow - line
    drawBarSticks(gs, callBy)

    // arrow - head
    gs.append("div")
    .attr("class", d =>
      "head c" + d.color.replace("#", "") +
      (d.isKick ? " js-kick" : "") +
      (d.isEven ? " is-even" : "") +
      (callBy === 4 ? " c-d" : "")
    )
    .attr("title", d => d.title)
    .style("position", "absolute")
    .style("top", d => d.headTop + "px")
    .style("left", d => d.headLeftCalc)
    .style("border-width", d => d.borderWidths)
    .style("border-color", d => d.borderColors)
    .style("border-style", "solid")
    .style("transform", d => d.isEven ? "rotate(45deg)" : false)
    .on("click", (d, i) => dropColorOnShape(d.color.replace("#", ""), d.isEven))
  }

  fixPixelOutOfLayoutOnce() {
    // set once with one chart data
    if (this.props.data.margin) return

    const elChart = document.querySelector("#" + this.props.id + " .canvas")
    const chartWidth = elChart.offsetWidth
    const elKicks = [...elChart.querySelectorAll(".js-kick")]

    // test1: return if no kicks
    if (elKicks.length === 0) {
      this.margin = {left: 0, right: 0}
      return
    }

    // NOTE: additional tick shift due to rotation
    const tickRotate = Math.ceil((tickShift*Math.sqrt(2) /* 45deg  rotation */ - tickShift)*10) / 10
    const ls = elKicks.map(el => el.offsetLeft - (el.classList.contains("is-even") ? tickRotate : 0)).filter(left => left < 0)
    const rs = elKicks.map(el => el.offsetLeft + tickShift*2 + (el.classList.contains("is-even") ? tickRotate : 0)).filter(right => right > chartWidth)
    const groupMarginLeft  = ls.length === 0 ? 0 : Math.ceil(Math.abs(Math.min(...ls)))
    const groupMarginRight = rs.length === 0 ? 0 : Math.ceil(Math.max(...rs) - chartWidth)

    // test2: return if kicks don't break layout
    if (groupMarginLeft === 0 && groupMarginRight === 0) {
      this.margin = {left: 0, right: 0}
      return
    }

    // fix
    const elGroups = [...elChart.querySelectorAll(".shape")]
    elGroups.forEach(el => el.style.margin = "0 " + groupMarginRight + "px 0 " + groupMarginLeft + "px")
    this.margin = {left: groupMarginLeft, right: groupMarginRight}
    //console.log("fix!")
    //console.log("margin:", groupMarginLeft, groupMarginRight)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArrowOnBar)


function getArrowData(d) {
  switch (true) {
    case d.value[1] - d.value[0] > 0:
    // increase, right
    //console.log("shift:", d.shift)
    return {
      color: colors[0],
      headTop: headTop,
      headLeftCalc: "calc(" + (d.shift + d.width) + "% - " + headSize + "px)",
      lineLeftCalc: d.shift + "%",
      borderWidths: "6px 0 6px 12px",
      borderColors: "transparent " + colors[0],
      isKick: d.shift < 3 ? true : false // largar than 3% of shift won't cause pixel out of layout issue
    }
    // decrease, left
    case d.value[1] - d.value[0] < 0:
    return {
      color: colors[1],
      headTop: headTop,
      headLeftCalc: d.shift + "%",
      lineLeftCalc: "calc(" + d.shift + "% + " + headSize/2 + "px)",
      borderWidths: "6px 12px 6px 0",
      borderColors: "transparent " + colors[1]
    }
    // even
    default:
    return {
      color: colors[6],
      headTop: 3,
      headLeftCalc: "calc(" + d.shift + "% - " + tickShift + "px)",
      lineLeftCalc: 0,
      borderWidths: tickShift + "px",
      borderColors: colors[6],
      isKick: true,
      isEven: true
    }
  }
}
