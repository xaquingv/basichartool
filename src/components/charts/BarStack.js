import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapeArray} from '../../lib/array'
import {drawPlot} from './bar'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/


const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Bar extends React.Component {
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.col >= 2 && count.number > 1 && count.row > 1 && count.date ===0) {
      d3.select("#barStack")
      .classed("d-n", false)
    } else {
      d3.select("#barStack")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const dataGroup = dataCols[0].values
    const dataNumbers = swapeArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const dataNumbersAll = [].concat.apply([], dataNumbers)
    const dataNumberSums = dataNumbers.map(ns => ns.reduce((n1, n2) => n1 + n2))

    /* validate 2 */
    const isAllPositiveOrNegative =
      dataNumbersAll.filter(num => num < 0).length === 0 ||
      dataNumbersAll.filter(num => num > 0).length === 0

    if (!isAllPositiveOrNegative) {
      d3.select("#barStack")
      .classed("d-n", true)
      return
    }

    const domain = d3.extent(dataNumberSums)
    if (domain[0] > 0) {
      domain[0] = 0
    } else if (domain[1] < 0) {
      domain[1] = 0
    }

    const scaleX = d3.scaleLinear()
    .domain(domain)
    .range([0, 100])

    const dataChart = dataGroup.map((group, i) => ({
      group: group,
      value: dataNumbers[i].map((num, j) => ({
        title: num,
        width: Math.abs(scaleX(num) - scaleX(0)),
        shift: (num < 0 && j===0) ? scaleX(dataNumberSums[i]) : 0
      }))
    }))


    /* draw */
    drawPlot(els, dataChart)
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
