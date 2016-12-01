import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawLine} from './line'
import {drawPlot} from './plot'
import {swapArray} from '../../lib/array'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const width = 320
const height = width*0.6

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Slope extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const dataCols = this.props.dataChart.cols
    const dataNumbers = dataCols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    const dataChart = dataNumbers.map((numberCol, i) =>
      numberCol.map(number => ({
        date: i,//dataDates[i],
        number: number
    })))

    // swap
    const dataChartSlope = swapArray(dataChart)
    const dataChartColor = dataChartSlope.map(d => {
      switch (true) {
        case d[1].number - d[0].number > 0: return "#4dc6dd"  // blue-light
        case d[1].number - d[0].number < 0: return "#005789"  // blue-dark
        default: return "#dfdfdf"                             // grey
      }
    })
    //console.log(dataChartSlope)
    //console.log(dataChartColor)


    /* draw */
    const els = this.refs

    // line(s)
    const scaleX = d3.scaleLinear()
    .domain([0, 1]/*d3.extent(dataDates)*/)
    .range([75, width-75])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawLine(els, dataChartSlope, scaleX, scaleY)
    d3.selectAll("#slope path")
    .attr("stroke", (d, i) => dataChartColor[i])

    // circles (plot)
    drawPlot(els, dataChartSlope, scaleX, scaleY, "line")
    // try d3.select(els).selectAll("g")
    d3.selectAll("#slope g")
    .style("fill", (d, i) => dataChartColor[i])
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slope)
