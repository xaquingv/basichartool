import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendChartData} from '../../actions'
import {addBarsBackground, drawBarSticks} from './onBar'
import ComponentRow from './BarBase'

const barHeight = 16
const dotSzie = 10
const dotTop = (barHeight - dotSzie) / 2
const margin = dotSzie/2

const mapStateToProps = state => ({
  data: state.dataChart,
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale, margins) => dispatch(appendChartData(keys, scale, margins))
})


class DotsOnBar extends React.Component {
  appendChartData() {
    const { isSelected } = this.props
    if (isSelected) { 
      const { data, onSelect } = this.props
      onSelect(data.keys, this.scale, {left: margin, right: margin}) 
    }
  }

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.appendChartData()
    
    // TODO: double check
    const { callByStep, colors } = this.props
    if (callByStep === 2) {
      d3.select(".js-graph .canvas").attr("data-bg-color", colors[6])
    }

    this.renderChart()
  }

  render() {
    const {data, callByStep} = this.props
    const isLabel = callByStep === 3
    
    return (
      <div className="canvas" ref="div">
        {data.string1Col.map((label, i) =>
        <ComponentRow isLabel={isLabel} label={label} key={i}/>
        )}
      </div>
    )
  }

  renderChart() {

    /* data */
    const {data, axis, callByStep} = this.props
    const domain = callByStep === 3 && axis ? axis.x.range : d3.extent(data.numbers)
    // using axis.x.range due to editable range @setup2, section 4

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(domain)
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

    const {colors, callByStep} = this.props
    let gs = addBarsBackground(this.refs.div, this.dataChart, margin)

    // line that connects dots
    const elCanvas = d3.select(".js-chart .canvas")
    const bgColor = (callByStep === 3 && elCanvas ? elCanvas.attr("data-bg-color") : colors[6]) || colors[6]
    drawBarSticks(gs, callByStep, bgColor)

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
