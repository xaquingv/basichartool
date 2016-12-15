import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Donut extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return (
      <svg ref="svg">
        <g ref="pie"></g>
      </svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const dataChart = data.numbers
    //const ...

    const pie = d3.pie()
    .sort(null)
    .value(d => d)

    const width = 300//this.props.width
    const height = width*0.6
    const radius = Math.min(width, height) / 2

    const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - radius*2/3)

    /* draw */
    // init area
    let svg = d3.select(this.refs.pie)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("path")
    .data(pie(dataChart))

    // update
    svg
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])

    // new
    svg.enter().insert("path", ":first-child")
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])
    .attr("shape-rendering", "auto")

    // remove
    svg.exit().remove()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Donut)
