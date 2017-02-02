import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {updateChartData} from '../../actions'


const barHeight = 72

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class BrokenBar extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) { onSelect(data.string1Col, this.scale) }
    }

    return (
      <div className="chart" ref="div" onClick={setChartData}>
      <div ref="bars"></div>
      <div ref="axis">
      <div ref="axis_tick"></div>
      <div ref="axis_mark">50%</div>
      </div>
      </div>
    )
  }

  renderChart() {
    // TODO: add multi broken bars as another chart

    /* data */
    const data = this.props.data
    const numbers = data.numbers

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain([0, numbers.reduce((n1, n2) => n1 + n2)])
    .range([0, 100])

    // chart
    this.dataChart = numbers.map(number => ({
      title: number,
      width: this.scale.x(number)
    }))

    /* draw */
    this.drawChart()
    this.drawAxis()
  }

  drawChart() {
    d3.select(this.refs.bars)
    .html("")
    .style("padding-top", 48 + "px") // override
    .style("height", barHeight + "px")
    .selectAll("div")
    .data(this.dataChart)
    .enter().append("div")
    .attr("title", d => d.title)
    .style("width", d => d.width + "%")
    .style("height", barHeight + "px")
    .style("display", "inline-block")
    .style("background-color", (d, i) => d ? this.props.colors[i] : "transparent")
  }

  drawAxis() {
    const els = this.refs

    d3.select(els.axis)
    .style("position", "relative")

    d3.select(els.axis_tick)
    .style("position", "absolute")
    .style("left", "50%")
    .style("height", "8px")
    .style("border-left", "1px solid #bdbdbd") //grey-3

    d3.select(els.axis_mark)
    .style("position", "absolute")
    .style("top", "10px")
    .style("width", "100%")
    .style("text-align", "center")
    .style("font-size", "12px")
    .style("color", "#bdbdbd")
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(BrokenBar)
