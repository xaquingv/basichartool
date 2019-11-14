import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'
import drawChart from './line'

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale) => dispatch(appendChartData(data, keys, scale))
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
    const keys = data.numberOnly ? data.keys.slice(1, data.keys.length) : data.keys
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, keys, this.scale) }
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
    const {data, colors/*, callByStep*/} = this.props
    const dataX = data.dateCol || data.numberCols[0]
    const numbers = data.numberOnly ? data.numbersButCol1 : data.numbers
    const numberCols = data.numberOnly ? data.numberCols.slice(1, data.numberCols.length) : data.numberCols
    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear

    // scale
    this.scale = {}
    this.scale.x = scaleTime()
    .domain(d3.extent(dataX))
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(numbers))
    .range([height, 0])

    // chart
    const dataChart = numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: dataX[i],
        y: number
    })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, colors)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
