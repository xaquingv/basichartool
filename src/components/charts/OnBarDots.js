import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {updateChartData} from '../../actions'
import {addBarsBackground, drawBarSticks} from './onBar'

const barHeight = 16
const dotSzie = 10
const dotTop = (barHeight - dotSzie) / 2

const mapStateToProps = (state) => ({
  data: state.dataChart,
  //colors: state.dataSetup.colorDiff
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class DotsOnBar extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) { onSelect(data.keys, this.scale) }
    }

    return (
      <div className="chart" ref="div" onClick={setChartData}></div>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.data

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([0, 100])

    // chart
    this.dataChart = data.numberRows.map((nums, i) => ([{
      width: Math.abs(this.scale.x(nums[1]) - this.scale.x(nums[0])),
      shift: this.scale.x(Math.min(nums[0], nums[1])),
      dots: nums.map((n, i) => {
        const isOverlapped = nums[0] === nums[1]
        return {
          title: n,
          topCalc: (isOverlapped ? i*dotTop*2 : dotTop) + "px", // 0, 3 (default), 6
          leftCalc: "calc(" + this.scale.x(n) + "% - " + (dotSzie/2) + "px)"
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

export default connect(mapStateToProps, mapDispatchToProps)(DotsOnBar)
