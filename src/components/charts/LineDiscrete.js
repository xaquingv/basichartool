import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import drawChart from './line'
import { width, height, viewBox } from '../../data/config'
import { appendChartData } from '../../actions'

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  colors: state.dataSetup.colors, 
  selection: state.selection
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale) => dispatch(appendChartData(data, keys, scale))
})


class LineDiscrete extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const { data, onSelect, callByStep } = this.props
    const keys = data.numberOnly ? data.keys.slice(1, data.keys.length) : data.keys
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, keys, this.scale) }
    }

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-2px",
        width: "calc(100% - " + (data.indent + 1) + "px)",
        height: data.height + "%",
        padding: "1px",
        marginTop: data.marginTop + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors } = this.props
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
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        x: i,
        y: number
      })))


    /* draw */
    drawChart(this.refs, dataChart, this.scale, colors)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineDiscrete)
