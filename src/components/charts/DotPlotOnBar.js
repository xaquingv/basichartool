import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {addBarsBackground, drawBarSticks} from './barOnBar'
import {setupLegend} from '../../actions'

const barHeight = 16
const dotSzie = 10
const dotTop = (barHeight - dotSzie) / 2

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => {
    dispatch(setupLegend(keys))
  }
})



class Bar extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {callByStep, dataChart, onSelect} = this.props

    const setLegendData = () => {
      if (callByStep === 3) { onSelect(dataChart.keys) }
    }

    return (
      <div className="chart" ref="div" onClick={setLegendData}></div>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([0, 100])

    this.dataChart = data.numberRows.map((nums, i) => ([{
      width: Math.abs(scaleX(nums[1]) - scaleX(nums[0])),
      shift: scaleX(Math.min(nums[0], nums[1])),
      dots: nums.map((n, i) => {
        const isOverlapped = nums[0] === nums[1]
        return {
          title: n,
          topCalc: (isOverlapped ? i*dotTop*2 : dotTop) + "px", // 0, 3 (default), 6
          leftCalc: "calc(" + scaleX(n) + "% - " + (dotSzie/2) + "px)"
        }
      })
    }]))

    /* draw */
    this.drawChart()
  }

  drawChart() {

    let gs = addBarsBackground(this.refs.div, this.dataChart, dotSzie/2)

    // line that connects dots
    drawBarSticks(gs)

    // dots
    gs.selectAll(".dot")
    .data(d => d.dots)
    .enter().append("div")
    .attr("class", "dots")
    .attr("title", d => d.title)
    .style("background-color", (d, i) => colors[i])
    .style("width", dotSzie + "px")
    .style("height", dotSzie + "px")
    .style("position", "absolute")
    .style("top", d => d.topCalc)
    .style("left", d => d.leftCalc)
    .style("border-radius", (dotSzie/2) + "px")
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
