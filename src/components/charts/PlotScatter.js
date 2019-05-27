import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import drawChart from './plot'
import { uniqueArray } from '../../lib/array'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class ScatterPlot extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const { data, onSelect, callByStep } = this.props
    const setChartData = () => {
      if (callByStep === 3) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : [""]
        onSelect(legendKeys, this.scale)
      }
    }
    // temp:
    console.log(data.indent);

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-4px",
        width: "calc(100% - " + (data.indent + 1) + "px)",
        height: data.height + "%",
        padding: "3px",
        marginTop: data.marginTop + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, axis, callByStep } = this.props
    const names = data.string1Col
    const numberCols = data.numberCols
    const numberRows = data.numberRows
    const colorGroup = data.string2Col
    const domain = callByStep === 4 && axis ? axis.x.range : d3.extent(numberCols[0])
    // using axis.x.range due to editable range @setup2, section 4
    this.colorKeys = uniqueArray(data.string2Col)

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
      .domain(domain)
      .range([0, width])

    this.scale.y = d3.scaleLinear()
      .domain(d3.extent(numberCols[1]))
      .range([height, 0])

    const scaleColors = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(colors)

    // temp: add size scale
    if (data.numberCols[2]) {
      this.scale.r = d3.scaleLinear()
        .domain(d3.extent(numberCols[2]))
        .range([3, 30])
    }

    // TODO: overlap case
    // 1 px shift from center following the circle, degree divided by count
    // http://stackoverflow.com/questions/3436453/calculate-coordinates-of-a-regular-polygons-vertices
    //let count = {}
    //numberRows.forEach(n => { count["x"+n[0]+"y"+n[1]] = (count["x"+n[0]+"y"+n[1]] || 0 ) + 1 })
    //console.log(count)

    // chart
    const dataChart = [numberRows.map((n, i) => {
      //const countOverlap = count["x"+n[0]+"y"+n[1]]
      //const isOverlapped = countOverlap > 1
      //if (isOverlapped) console.log(n[0], n[1], countOverlap)
      return {
        x: n[0],
        y: n[1],
        r: n[2],
        color: scaleColors(colorGroup[i]),//colorGroup[group[i]],
        title: names[i] + " [" + n[0] + ", " + n[1] + "]"//,
      }
    })]


    /* draw */
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot)
