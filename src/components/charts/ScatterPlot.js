import React from 'react'
import {connect} from 'react-redux'
import {drawPlot} from './plot'
import {d3} from '../../lib/d3-lite'

/*
  data spec
  missing data accepted
  cols [2, many]
  - date: repeat is allowed
  - number: any range                 => country's color
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


class Line extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.date !== 1 || count.number < 1 || count.row > 125) {
      d3.select(els.svg)
      .classed("d-n", true)
      console.log("no line")
      return
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
    const scaleX = d3.scaleTime()
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

export default connect(mapStateToProps, mapDispatchToProps)(Line)
