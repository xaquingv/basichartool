import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {addBarsBackground, drawBarSticks} from './barOnBar'

/*
data spec
missing data accepted
cols [4, many]
- date: no-repeat
- number*: any range, min 3
*/

const barHeight = 16
const headSize = 12
const headTop = (barHeight - headSize) / 2
const tickShift = 5

let groupMargin = {}

const mapStateToProps = (state) => ({
  stepUser: state.step,
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class ArrowOnBar extends React.Component {
  /* update controls */
  componentDidMount() {
    ///console.log("init ArrowOnBar at step", this.props.step)
    if (this.props.isUpdate) this.setState({kickUpdate: true})
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isSelected && nextProps.stepUser === nextProps.stepCall
  }

  componentDidUpdate() {
    //console.log("draw ArrowOnBar at step", this.props.callByStep)

    /* data */
    const data = this.props.dataChart
    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([0, 100])

    const dataRows = data.numberRows.map((nums, i) => ({
      value: nums,
      width: Math.abs(scaleX(nums[1]) - scaleX(nums[0])),
      shift: scaleX(Math.min(nums[0], nums[1]))
    }))

    const dataChart = dataRows.map(d => {
      const nums = d.value
      return [{
        title: nums[0] === nums[1] ? nums[0] : Math.min(nums[0], nums[1]) + " - " + Math.max(nums[0], nums[1]),
        widthCalc: "calc(" + d.width + "% - " + headSize/2 + "px)",
        ...getArrowData(d)
      }]
    })
    //console.log(dataRows)
    //console.log(dataChart)


    /* draw */
    drawChart(this.refs, dataChart)


    /* validate special */
    // NOTE: fix pixel out of bar issue (range [0, 3px])
    // due to extrem even values at two ends
    // which causes faulty layout on iOS mobile
    fixPixelOutOfLayout(this.props.id)
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArrowOnBar)


function getArrowData(d) {
  switch (true) {
    case d.value[1] - d.value[0] > 0:
    // increase, right
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


function drawChart(els, dataChart) {
  let gs = addBarsBackground(els.div, dataChart, 0)

  // arrow - line
  drawBarSticks(gs)

  // arrow - head
  gs.append("div")
  .attr("class", d => "head" + (d.isKick ? " js-kick" : "") + (d.isEven ? " is-Even" : ""))
  .attr("title", d => d.title)
  .style("position", "absolute")
  .style("top", d => d.headTop + "px")
  .style("left", d => d.headLeftCalc)
  .style("border-width", d => d.borderWidths)
  .style("border-color", d => d.borderColors)
  .style("border-style", "solid")
  .style("transform", d => d.isEven ? "rotate(45deg)" : false)
}


function fixPixelOutOfLayout(chartId) {
  const elChart = document.querySelector("#" + chartId + " .chart")
  const chartWidth = elChart.offsetWidth - 20 // padding
  const elKicks = [...elChart.querySelectorAll(".js-kick")]

  // test1: return if no kicks
  if (elKicks.length === 0) return

  // NOTE: additional tick shift due to rotation
  const tickRotate = Math.ceil((tickShift*Math.sqrt(2) /* 45deg  rotation */ - tickShift)*10) / 10
  const ls = elKicks.map(el => el.offsetLeft - (el.classList.contains("is-Even") ? tickRotate : 0)).filter(left => left < 0)
  const rs = elKicks.map(el => el.offsetLeft + tickShift*2 + (el.classList.contains("is-Even") ? tickRotate : 0)).filter(right => right > chartWidth)
  groupMargin.left  = ls.length === 0 ? 0 : Math.abs(Math.min(...ls))
  groupMargin.right = rs.length === 0 ? 0 : Math.max(...rs) - chartWidth

  // test2: return if kicks don't break layout
  if (groupMargin.left === 0 && groupMargin.right === 0) return

  // fix
  const elGroups = [...elChart.querySelectorAll(".group")]
  elGroups.forEach(el => el.style.margin = "0 " + groupMargin.right + "px 0 " + groupMargin.left + "px")
  //console.log("groupMargin:", groupMargin)
}
