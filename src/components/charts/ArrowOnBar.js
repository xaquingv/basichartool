import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors, colorBarBackground} from '../../data/config'

/*
data spec
missing data accepted
cols [4, many]
- date: no-repeat
- number*: any range, min 3
*/

const barHeight = 16
const barMarginBottom = 8
const bodyHeight = 4
const bodyTop = (barHeight - bodyHeight) / 2
const headSize = 12
const headTop = (barHeight - headSize) / 2

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

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
        shift: d.shift,
        widthCalc: "calc(" + d.width + "% - " + headSize/2 + "px)",//d.width,
        ...getArrowData(d)
      }]
    })
    //console.log(dataRows)
    //console.log(dataChart)


    /* draw */
    drawChart(this.refs, dataChart)
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)


function getArrowData(d) {
  switch (true) {
    case d.value[1] - d.value[0] > 0:
    // increase, right
    return {
      color: colors[0],
      headTop: headTop,
      headLeftCalc: "calc(" + (d.shift + d.width) + "% - " + headSize + "px)",
      bodyLeftCalc: d.shift + "%",
      borderWidths: "6px 0 6px 12px",
      borderColors: "transparent " + colors[0]
      // TODO: shift for arrow body
    }
    // decrease, left
    case d.value[1] - d.value[0] < 0:
    return {
      color: colors[1],
      headTop: headTop,
      headLeftCalc: d.shift + "%",
      bodyLeftCalc: "calc(" + d.shift + "% + " + headSize/2 + "px)",
      borderWidths: "6px 12px 6px 0",
      borderColors: "transparent " + colors[1]
    }
    // even
    default:
    return {
      color: colors[6],
      headTop: 0,
      headLeftCalc: "calc(" + d.shift + "% - " + headSize/2 + "px)", // arrow head left
      bodyLeftCalc: d.shift + "%", // arrow body left
      borderWidths: "8px " + headSize/2 + "px",
      borderColors: colors[6]
    }
  }
}

function drawChart(els, dataChart) {

  let gs = d3.select(els.div)
  .html("")
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .style("height", barHeight + "px")
  .style("margin-bottom", barMarginBottom + "px")
  .style("background-color", colorBarBackground)
  // TODO: may need to shift due to extram even numbers at two ends
  .append("div")
  .attr("class", "group")
  .style("position", "relative")
  //.style("margin", "0")
  .selectAll("div")
  .data(d => d)
  .enter()

  // arrow - body
  // NOTE: similar to DotPlotOnBar's bar
  gs.append("div")
  .attr("class", "arrow-body")
  .attr("title", d => d.title)
  .style("width", d => d.widthCalc)
  .style("height", bodyHeight + "px")
  .style("position", "absolute")
  .style("top", bodyTop + "px")
  .style("left", d => d.bodyLeftCalc)
  .style("background-color", d => d.color)

  // arrow - head
  gs.append("div")
  .attr("class", "arrow-head")
  .attr("title", d => d.title)
  .style("position", "absolute")
  .style("top", d => d.headTop + "px")
  .style("left", d => d.headLeftCalc)
  .style("border-width", d => d.borderWidths)
  .style("border-color", d => d.borderColors)
  .style("border-style", "solid")
}
