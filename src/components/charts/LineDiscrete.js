import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawLine} from './line'

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


class Line extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.date !== 1 || count.number < 1 || count.row < 3) {
      d3.select("#lineDiscrete")
      .classed("d-n", true)
      return
    } else {
      //console.log("line discrete")
      d3.select("#lineDiscrete")
      .classed("d-n", false)
    }


    /* data */
    const dataNumbers = this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    const dataChart = dataNumbers.map(numberCol =>
      numberCol.map((number, i) => ({
        date: i,
        number: number
    })))


    /* draw */
    const scaleX = d3.scaleLinear()
    .domain([0, count.row-1])
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawLine(els, dataChart, scaleX, scaleY)
  }

  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
