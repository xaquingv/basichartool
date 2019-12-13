import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import drawChart from './line'
import { width, height, viewBox } from '../../data/config'
import { appendChartData } from '../../actions'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class LineDiscrete extends React.Component {
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
    const { data } = this.props

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-2px",
        width: "calc(100% - " + (data.indent + 1) + "px)",
        height: data.height + "%",
        padding: "1px",
        marginTop: data.marginTop + "%"
      }}></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors } = this.props
    const numberCols = data.numberCols
    //const numbers = data.numberOnly ? data.numbersButCol1 : data.numbers
    //const numCols = data.numberCols.slice(1, data.numberCols.length)

    // scale
    this.scale = {}
    // NOTE: x can be date, string, or number?
    this.scale.x = d3.scaleLinear()
      .domain([0, data.rowCount - 1])
      .range([0, width])

    this.scale.y = d3.scaleLinear()
      .domain(d3.extent(data.numbers))
      .range([height, 0])

    // chart
    const dataChart = numberCols.map((numberCol, iCol) => {
      const color = colors[iCol]   
      const line = numberCol.map((number, i) => ({
        x: i,
        y: number
      }))
      return {color, line}
    }).reverse() // reverse to draw the first chart last

    /* draw */
    drawChart(this.refs, dataChart, this.scale)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineDiscrete)
