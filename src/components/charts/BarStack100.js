import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapArray} from '../../lib/array'
import {drawPlot} from './bar'

/*
  data spec
  no missing data
  cols [4, many]
  - string: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const dataCols = this.props.dataChart.cols
    const dataGroup = dataCols[0].values
    const dataNumbers = swapArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    // TODO: doube check
    /* validate 2 * /
    // NOTE: round to avoid system number digit issue
    const isAll100 = dataNumberSums.filter(sum => sum === 100).length === dataNumberSums.length
    const dataNumbersAll = [].concat.apply([], dataNumbers)
    const isAllPositive = dataNumbersAll.filter(num => num < 0).length === 0
    //console.log("isAllPositive", isAllPositive)
    if (isAll100 || !isAllPositive) {
      d3.select("#barStack100")
      .classed("d-n", true)
      return
    }*/

    const dataNumberSums = dataNumbers.map(ns => Math.round(ns.reduce((n1, n2) => n1 + n2)*100)/100)
    const scaleX = (i) => d3.scaleLinear()
    .domain([0, dataNumberSums[i]])
    .range([0, 100])

    const dataChart = dataGroup.map((group, i) => {
      let scale = scaleX(i)
      return {
        group: group,
        value: dataNumbers[i].map(num => ({
          title: num,
          width: scale(num)
        }))
      }
    })


    /* draw */
    const els = this.refs
    drawPlot(els, dataChart)
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
