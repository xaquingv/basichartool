import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { appendChartData } from '../../actions'


const barHeight = 72

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class BrokenBar extends React.Component {
  appendChartData() {
    if (this.props.isSelected) {
      const { data, onSelect } = this.props
      const legendKeys = data.string1Col.length !== 0 ? data.string1Col : data.keys
      onSelect(legendKeys, this.scale)
    }
  }

  componentDidMount() {
    this.renderChart()
    this.appendChartData()
  }
  componentDidUpdate() {
    this.appendChartData()
    this.renderChart()
  }

  render() {
    const { callByStep } = this.props

    const drawLabel = callByStep === 3 ?
      (
        <div ref="txts" style={{
          lineHeight: "16px",
          margin: "8px 0"
        }}></div>
      ) : null

    return (
      <div className="canvas" ref="div">
        <div className="bar" ref="bars"></div>
        {drawLabel}
      </div>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.data
    const numbers = data.numbers

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
      .domain([0, numbers.reduce((n1, n2) => n1 + n2)])
      .range([0, 100])

    // chart
    this.dataChart = numbers.map((number, i) => ({
      title: number,
      width: Math.round(this.scale.x(number) * 100) / 100
    }))


    /* draw */
    this.drawChart()
    this.drawLabel()
  }

  drawChart() {
    d3.select(this.refs.bars)
      .html("")
      .style("height", barHeight + "px")
      .selectAll(".rect")
      .data(this.dataChart)
      .enter().append("div")
      .attr("title", d => d.title)
      .style("width", d => d.width + "%")
      .style("height", barHeight + "px")
      .style("display", "inline-block")
      .style("background-color", (d, i) => d ? this.props.colors[i] : "transparent")
  }

  drawLabel() {
    if (this.props.callByStep !== 3) return

    const labels = d3.select(this.refs.txts)
      .html("")
      .selectAll(".txts")
      .data(this.dataChart)
      .enter().append("div")
      .attr("class", "txts")
      .attr("data-width", d => d.width)
      .style("width", d => d.width + "%")
      .style("display", "inline-block")
      .style("vertical-align", "top")

    labels.append("span")
      .attr("class", (d, i) => "txt num")
      .attr("contenteditable", true)
      .style("font-family", "'Guardian Agate Sans 1 Web', monospace")
      .style("font-weight", "bold")
      .style("word-wrap", "normal")
      .style("color", (d, i) => d ? this.props.colors[i] : "transparent")
      .text(d => d.title + (d.title === d.width ? "%" : ""))

    const strings = this.props.data.string3Col
    if (!strings) return
    labels.append("br")
    labels.append("span")
      .attr("class", (d, i) => "txt str")
      .attr("contenteditable", true)
      .style("word-wrap", "normal")
      .text((d, i) => strings[i])
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrokenBar)
