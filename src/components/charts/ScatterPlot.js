import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawPlot} from './plot'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: repeat accepted
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


class Scatter extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.date !== 1 || count.number < 2 || count.row < 3 /*|| count.row > 125*/) {
      d3.select("#dotPlot")
      .classed("d-n", true)
      return
    } else {
      d3.select("#dotPlot")
      .classed("d-n", false)
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const types = dataCols.map(d => d.type)
    const dates = dataCols[types.indexOf("date")].values

    const dataNumbers = this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    const dataChart = dataNumbers.map(numberCol =>
      numberCol.map((number, i) => ({
        date: dates[i],
        number: number
    })))


    /* draw */
    const scaleTime = dataCols[types.indexOf("date")].hasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dates))
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawPlot(els, dataChart, scaleX, scaleY, "scatter")
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scatter)
