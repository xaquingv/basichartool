import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Scatter extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return (
      <svg ref="svg"></svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const dates = data.dateCol

    // TODO: overlap case, see ScatterPlot.js
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dates[i],
        y: number
    })))

    const width = this.props.width
    const height = width*0.6

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(dates))
    .range([0, width])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(data.numbers))
    .range([height, 0])

    /* draw */
    drawChart(this.refs, dataChart, scaleX, scaleY, "scatter")
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scatter)
