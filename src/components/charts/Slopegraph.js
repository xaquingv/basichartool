import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import {appendChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'
import drawChartLine from './line'
import drawChartPlot from './plot'

const radius = 3

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  //colors: state.dataSetup.colorDiff
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale) => dispatch(appendChartData(data, keys, scale))
})


class Slope extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, [""], this.scale) }
    }

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-1px",
        width: "calc(100% - " + (data.indent) + "px)",
        height: data.height + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const {data, id} = this.props

    // scale
    const scaleXL = d3.scaleLinear() //longer
    .domain([0, 1])
    .range([75, width-75])
    const scaleXS = d3.scaleLinear() //shorter
    .domain([0, 1])
    .range([75+radius, width-75-radius])

    this.scale = {}
    this.scale.y = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([height-radius, radius])

    // chart
    const dataChart = data.numberRows.map((numberRow, i) =>
      numberRow.map((number, j) => ({
        x: j,
        y: number
    })))
    .reverse()
    //console.log(dataChart)
    // NOTE: * reverse to draw in better order
    // in case of position adjustment due to dots overlapped

    // 1a. color change
    //const colors = this.props.colors
    const dataColor = dataChart.map(d => {
      switch (true) {
        case d[1].y - d[0].y > 0: return colors[0]  // blue-light
        case d[1].y - d[0].y < 0: return colors[1]  // blue-dark
        default: return colors[6]                   // grey
      }
    })

    // 2a. dot position adjustment
    const dataChartNumberDuplicates =
      getDuplicatNumbers(data.numberCols, dataColor, dataChart.length)


    /* draw */
    const els = this.refs
    // line(s)
    drawChartLine(els, dataChart, {x: scaleXS, y: this.scale.y})
    // dots (plot)
    drawChartPlot(els, dataChart, {x: scaleXL, y: this.scale.y}, "line")

    // 1b. change colors
    // TODO: move to dataChart and color in line.js and plot.js?
    d3.selectAll("#" + id + " path")
    .attr("stroke", (d, i) => dataColor[i])
    d3.selectAll("#" + id + " g")
    .style("fill", (d, i) => dataColor[i])

    // 2b. adjust dot(s) position if overlapped
    const chartEl = document.querySelector("#" + id)
    dataChartNumberDuplicates.forEach(d => {
      const el = chartEl.querySelectorAll("g")[d.rowId].childNodes[d.colId]
      const cx = +el.getAttribute("cx")
      const shift = (d.colId === 0 ? -2 : 2) * (d.count-1)
      el.setAttribute("cx", cx + shift)
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slope)


function getDuplicatNumbers(dataNumberCols, dataColor, lenCol) {

  const dupNumberCols = dataNumberCols.map((col, i) => ({
    id: i,
    numbers: col
  })).filter(col =>
    // if values duplicate ..
    uniqueArray(col.numbers).length !== lenCol
  ).map(col => {
    // count of dot with same value and colors
    let count = {}
    col.numbers.forEach((num, index) => {
      count[num+dataColor[index]] = (count[num+dataColor[index]] || 0 ) + 1
    })

    // get duplicate dots (with different colors)
    return col.numbers.map((num, index) => ({
      value: num,
      color: dataColor[index],
      rowId: lenCol - index - 1, // due to reverse*
      colId: col.id,
      count: col.numbers.slice(0, index+1).filter((n, i) => n === num).length
    })).filter(d =>
      d.count > 1 && count[d.value+d.color] === 1
    )
  })

  const dupNumbers = dupNumberCols.length ?
    dupNumberCols.reduce((col1, col2) => col1.concat(col2)) : // merge
    dupNumberCols

  return dupNumbers
}
