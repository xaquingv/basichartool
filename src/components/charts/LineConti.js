import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {updateChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'
import drawChart from './line'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class Line extends React.Component {

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
        top: "-2px",
        width: "calc(100% - " + (data.indent+1) + "px)",
        height: data.height + "%",
        padding: "1px",
        marginTop: data.marginTop + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const {data, colors} = this.props
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
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dates[i],
        y: number
    })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, colors)


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
