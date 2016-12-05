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
const dotSzie = 10
const dotTop = (barHeight - dotSzie) / 2

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

    const dataChart = data.numberRows.map((nums, i) => ([{
      width: Math.abs(scaleX(nums[1]) - scaleX(nums[0])),
      shift: scaleX(Math.min(nums[0], nums[1])),
      dots: nums.map((n, i) => {
        const isOverlapped = nums[0] === nums[1]
        return {
          topCalc: (isOverlapped ? i*dotTop*2 : dotTop) + "px", // 0, 3 (default), 6
          leftCalc: "calc(" + scaleX(n) + "% - " + (dotSzie/2) + "px)"
        }
      })
    }]))
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


function drawChart(els, dataChart) {

  let gs = d3.select(els.div)
  .html("")
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .style("height", barHeight + "px")
  .style("margin-bottom", barMarginBottom + "px")
  .style("background-color", colorBarBackground)
  // shift half dot size
  .append("div")
  .attr("class", "group")
  .style("position", "relative")
  .style("margin", "0 " + (dotSzie/2) + "px")
  .selectAll("div")
  .data(d => d)
  .enter()
  console.log(gs)

  // bar
  // NOTE: similar to ArrowOnBar's arrow-body
  gs.append("div")
  .attr("class", "bar")
  .style("width", d => d.width + "%")
  .style("height", bodyHeight + "px")
  .style("position", "absolute")
  .style("top", bodyTop + "px")
  .style("left", d => d.shift + "%")
  .style("background-color", d => colors[6])

  // dots
  gs.selectAll(".dots")
  .data(d => d.dots)
  .enter().append("div")
  .attr("class", "dots")
  .style("width", dotSzie + "px")
  .style("height", dotSzie + "px")
  .style("border-radius", (dotSzie/2) + "px")
  .style("background-color", (d, i) => colors[i])
  .style("position", "absolute")
  .style("left", d => d.leftCalc)
  .style("top", d => d.topCalc)
}
