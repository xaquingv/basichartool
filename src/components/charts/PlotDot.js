import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'
import {updateChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class DotPlot extends React.Component {

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
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-4px",
        width: "calc(100% - " + (data.indent+1) + "px)",
        height: data.height + "%",
        padding: "3px",
        marginTop: data.marginTop + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const {data, colors, callByStep} = this.props
    const dates = data.dateCol

    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear

    // scale
    this.scale = {}
    this.scale.x = scaleTime()
    .domain(d3.extent(dates))
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([height, 0])

    // chart
    // TODO: overlap case, see ScatterPlot.js
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dates[i],
        y: number
    })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DotPlot)
