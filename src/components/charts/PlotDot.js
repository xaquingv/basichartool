// TODO: scale and viewbox fix like scatter plot

import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'
import {appendChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'

const mapStateToProps = state => ({
  data: state.dataChart,
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class DotPlot extends React.Component {
  appendChartData() {
    if (this.props.isSelected) { 
      const { data, onSelect } = this.props
      const keys = data.numberOnly ? data.keys.slice(1, data.keys.length) : data.keys
      onSelect(keys, this.scale) 
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
    const {data} = this.props

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-4px",
        width: "calc(100% - " + (data.indent+1) + "px)",
        height: data.height + "%",
        padding: "3px",
        marginTop: data.marginTop + "%"
      }}></svg>
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
