// TODO: scale and viewbox fix like scatter plot

import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'
import {appendChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale) => dispatch(appendChartData(data, keys, scale))
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
    const keys = data.numberOnly ? data.keys.slice(1, data.keys.length) : data.keys
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, keys, this.scale) }
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
    const {data, colors, axis, callByStep} = this.props
    const dates =
    data.dateCol || data.numberCols[0]
    //data.dateCol || (data.string1Col.length !== 0 ? data.string1Col : data.numberCols[0])
    const numbers = data.numberOnly ? data.numbersButCol1 : data.numbers
    const numberCols = data.numberOnly ? data.numberCols.slice(1, data.numberCols.length) : data.numberCols
    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear
    const domain = callByStep === 3 && axis ? axis.x.range : d3.extent(dates)
    // using axis.x.range due to editable range @setup2, section 4

    // scale
    this.scale = {}
    this.scale.x = scaleTime()
    .domain(domain)
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(numbers))
    .range([height, 0])

    // chart
    // TODO: overlap case, see ScatterPlot.js
    const dataChart = numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dates[i],
        y: number
    })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DotPlot)
