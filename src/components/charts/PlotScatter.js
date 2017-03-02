import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'
import {uniqueArray} from '../../lib/array'
import {updateChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class ScatterPlot extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : [""]
        onSelect(legendKeys, this.scale)
      }
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
    const {data, colors, callByStep} = this.props
    const names = data.string1Col
    const numberCols = data.numberCols
    const numberRows = data.numberRows
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(data.string2Col)

    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(d3.extent(numberCols[0]))
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(numberCols[1]))
    .range([height, 0])

    const scaleColors = d3.scaleOrdinal()
    .domain(this.colorKeys)
    .range(colors)

    // TODO: overlap case
    // 1 px shift from center following the circle, degree divided by count
    // http://stackoverflow.com/questions/3436453/calculate-coordinates-of-a-regular-polygons-vertices
    //let count = {}
    //numberRows.forEach(n => { count["x"+n[0]+"y"+n[1]] = (count["x"+n[0]+"y"+n[1]] || 0 ) + 1 })
    //console.log(count)

    const dataChart = [numberRows.map((n, i) => {
      //const countOverlap = count["x"+n[0]+"y"+n[1]]
      //const isOverlapped = countOverlap > 1
      //if (isOverlapped) console.log(n[0], n[1], countOverlap)
      return {
        x: n[0],
        y: n[1],
        color: scaleColors(colorGroup[i]),//colorGroup[group[i]],
        title: names[i] + " [" + n[0] + ", " + n[1] + "]"//,
      }
    })]


    /* draw */
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot)
