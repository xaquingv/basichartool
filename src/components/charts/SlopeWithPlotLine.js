import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawLine} from './line'
import {drawPlot} from './plot'
import {swapeArray} from '../../lib/array'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const width = 320;
const height = 320*0.6;

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Slope extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.number !== 2 || count.row > 25) {
      d3.select("#slope")
      .classed("d-n", true)
      return
    } else {
      d3.select("#slope")
      .classed("d-n", false)
    }


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

    // swape
    let dataChartSlope = swapeArray(dataChart)
    /*dataChart[0].map(() => [])
    dataChart.forEach((col, i) =>
      col.forEach((val, j) =>
        dataChartSlope[j][i] = val
      )
    )*/
    //console.log(dataChart)
    //console.log(dataChartSlope)

    /* draw */
    // line(s)
    const scaleX = d3.scaleLinear()
    .domain([0, 1]/*d3.extent(dataDates)*/)
    .range([75, width-75])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawLine(els, dataChartSlope, scaleX, scaleY)

    // circles (plot)
    drawPlot(els, dataChartSlope, scaleX, scaleY, "line")
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slope)
