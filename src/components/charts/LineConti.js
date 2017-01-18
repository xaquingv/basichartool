import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './line'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class Line extends React.Component {

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
      <svg ref="svg" onClick={setLegendData}></svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const dates = data.dateCol
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dates[i],
        y: number
    })))

    const width = this.props.width
    const height = width*0.6

    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dates))
    .range([0, width])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(data.numbers))
    .range([height, 0])

    /* draw */
    drawChart(this.refs, dataChart, scaleX, scaleY)

    /* validate special */
    // TODO: move to another validatetion file
    // NOTE: double check if discrete and conti are the same
    // if the same (duplicate), hide the discrete line
    const elLineDiscrete = d3.select("#lineDiscrete")
    const elLineContiPathD = d3.select("#lineConti path").attr("d")
    if (!elLineDiscrete) {
      return
    } else if (elLineContiPathD === elLineDiscrete.select("path").attr("d")) {
      elLineDiscrete.classed("d-n", true)
    } else if (elLineContiPathD !== elLineDiscrete.select("path").attr("d")) {
      elLineDiscrete.classed("d-n", false)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
