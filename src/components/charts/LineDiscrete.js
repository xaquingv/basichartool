import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './line'
import {width, height, viewBox} from '../../data/config'
import {updateChartData} from '../../actions'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class LineDiscrete extends React.Component {

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
    const {id, data, colors, callByStep} = this.props

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain([0, data.rowCount - 1])
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([height, 0])

    // chart
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: i,
        y: number
    })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, colors)

    if (callByStep === 4) return
    d3.select("#"+id).classed("d-n", false)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineDiscrete)
