import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import drawChartLine from './line'
import drawChartPlot from './plot'
import {uniqueArray} from '../../lib/array'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const width = 320
const height = width*0.6

const radius = 3

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Slope extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const data = this.props.dataChart
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
    const dataColor = dataChart.map(d => {
      switch (true) {
        case d[1].y - d[0].y > 0: return colors[0]  // blue-light
        case d[1].y - d[0].y < 0: return colors[1]  // blue-dark
        default: return colors[6]                   // grey
      }
    })
    console.log(dataColor)

    // 2a. dot position adjustment
    const dataChartNumberDuplicates =
      getDuplicatNumbers(data.numberCols, dataColor, dataChart.length)

    const scaleXL = d3.scaleLinear() //longer
    .domain([0, 1])
    .range([75, width-75])
    const scaleXS = d3.scaleLinear() //shorter
    .domain([0, 1])
    .range([75+radius, width-75-radius])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(data.numbers))
    .range([height-10, 10])


    /* draw */
    const els = this.refs

    // line(s)
    drawChartLine(els, dataChart, scaleXS, scaleY)
    // dots (plot)
    drawChartPlot(els, dataChart, scaleXL, scaleY, "line")

    // 1b. change colors
    const chartId = this.props.id
    d3.selectAll("#" + chartId + " path")
    .attr("stroke", (d, i) => dataColor[i])
    d3.selectAll("#" + chartId + " g")
    .style("fill", (d, i) => dataColor[i])

    // 2b. adjust dot(s) position if overlapped
    const chartEl = document.querySelector("#" + chartId)
    console.log(dataChartNumberDuplicates)
    dataChartNumberDuplicates.forEach(d => {
      const el = chartEl.querySelectorAll("g")[d.rowId].childNodes[d.colId]
      const cx = +el.getAttribute("cx")
      const shift = (d.colId === 0 ? -2 : 2) * (d.count-1)
      el.setAttribute("cx", cx + shift)
    })
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
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
