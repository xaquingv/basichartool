import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { isValuesDifferentInArrays } from '../../lib/array'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'
import drawLine from './line'
// import drawPlot from './plot'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colorLines
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class Line extends React.Component {
  appendChartData() {
    const { data, onSelect, callByStep } = this.props 
    const isRangeChange = data.scales.y ? isValuesDifferentInArrays(this.scale.y.domain(), data.scales.y.domain()) : false
    const isUpdate = /*callByStep 2*/ this.props.isSelected || (callByStep === 3 && isRangeChange)
    
    if (isUpdate) { 
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
    const { data } = this.props
    
    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" 
        style={{
          top: "-2px",
          width: "calc(100% - " + (data.indent + 1) + "px)",
          height: data.height + "%",
          padding: "1px",
          marginTop: data.marginTop + "%"
        }}
      ></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors/*, callByStep*/ } = this.props
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
    const dataChart = numberCols.map((numberCol, iCol) => {
      const color = colors[iCol]   
      const line = numberCol.map((number, i) => ({
        x: dataX[i],
        y: number 
      }))
      return {color, line}
    }).reverse() // reverse to draw the first chart last
      

    /* draw */
    drawLine(this.refs, dataChart, this.scale)
    // dataChart.forEach(data => drawPlot(this.refs, data.line, this.scale, "line", colors, callByStep))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
