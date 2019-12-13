import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import drawChart from './plot'
import { uniqueArray } from '../../lib/array'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'

const rangeSize = [3, 30];

const mapStateToProps = state => ({
  data: state.dataChart,
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors,
  dataParagraph: state.dataParagraph // ?
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale, margin) => dispatch(appendChartData(keys, scale, margin))
})


class ScatterPlot extends React.Component {
  appendChartData() {
    if (this.props.isSelected) { 
      const { onSelect } = this.props
      const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : [""]
      onSelect(legendKeys, this.scale, this.margin) 
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
    const { data, callByStep } = this.props

    // get viewBox
    let svg = document.querySelector(".js-graph svg");
    if (svg && callByStep === 3) {
      // callByStep === 3
      let svgClientRects = svg.getClientRects()[0]
      this.width = Math.ceil(svgClientRects.width)
      this.height = Math.ceil(svgClientRects.height)
      this.viewBox = "0 0 " + this.width + " " + this.height
    } else {
      // callBystep === 2
      this.width = width
      this.height = height
      this.viewBox = viewBox
    }

    return (
      <svg ref="svg" viewBox={this.viewBox} preserveAspectRatio="none" style={{
        top: "-4px",
        width: "calc(100% - " + (data.indent - 1) + "px)",
        height: data.height + "%",
        paddingTop: "3px",
        // paddingRight: "2px",
        marginTop: data.marginTop + "%",
      }}></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, axis, callByStep/*, dataParagraph*/ } = this.props

    const names = data.string1Col
    const numberCols = data.numberCols
    const numberRows = data.numberRows
    const colorGroup = data.string2Col
    const domain = callByStep === 3 && axis ? axis.x.range : d3.extent(numberCols[0])
    const isSize = data.numberCols[2] ? true : false;

    // using axis.x.range due to editable range @setup2, section 4
    this.colorKeys = uniqueArray(data.string2Col)
    this.isSize = isSize;

    // scale and margins
    this.scale = {}
    let marginX, marginY;

    if (isSize) {
      this.scale.r = d3.scaleLinear()
        .domain(d3.extent(numberCols[2]))
        .range(rangeSize)

      // scale x, y for margin calc 
      let scale = {
        x: d3.scaleLinear().domain(domain).range([0, this.width]),
        y: d3.scaleLinear().domain(d3.extent(numberCols[1])).range([this.height, 0])
      }
      // calc margin, params: x/y, r, scale.x/y, scale.r 
      marginX = this.getMargins(numberCols[0], numberCols[2], scale.x, this.scale.r, [0, this.width])
      marginY = this.getMargins(numberCols[1], numberCols[2], scale.y, this.scale.r, [0, this.height])
    }
    
    this.margin = {
      left: isSize ? marginX.min : rangeSize[0],
      right: isSize ? marginX.max : rangeSize[0],
      top: isSize ? marginY.min : rangeSize[0],
      bottom: isSize ? marginY.max : rangeSize[0]
    };

    // adjust x, y scale with margins
    this.scale.x = d3.scaleLinear()
      .domain(domain)
      .range([0, this.width - this.margin.left - this.margin.right])

    this.scale.y = d3.scaleLinear()
      .domain(d3.extent(numberCols[1]))
      .range([this.height - this.margin.top - this.margin.bottom, 0])

    const scaleColors = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(colors)

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
        title: names[i] + " [" + n[0] + ", " + n[1] + "]" + (isSize ? ", " + n[2] : "")//,
      }
    })]

    /* draw */
    //console.log(dataParagraph)
    //const countries = dataParagraph ?  dataParagraph.map(p => p.data.key) : null
    console.log(dataChart)
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep, this.margin/*, countries*/)
    // TOOD: reset view box
  }

  // calc margins if size is available
  // TODO: take extent ticks into consideration
  getMargins(colNumbers, colRadius, scaleNumbers, scaleRadius, nRange) {
    let ns = []
    colNumbers.forEach((num, idx) => {
      let r = colRadius[idx]
      let n = scaleNumbers(num)
      ns.push(n - scaleRadius(r)) // left
      ns.push(n + scaleRadius(r)) // right
    })
    return {
      min: Math.ceil(nRange[0] - Math.min(...ns)),
      max: Math.ceil(Math.max(...ns) - nRange[1])
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot)
