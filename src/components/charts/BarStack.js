import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapArray} from '../../lib/array'
import {drawPlot} from './bar'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class BarStack extends React.Component {

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

    const dataNumberSums = dataNumbers.map(ns => ns.reduce((n1, n2) => n1 + n2))

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
    const els = this.refs
    drawPlot(els, dataChart)
  }

  render() {
    return (
      //<div className="chart" ref={theNode => this.drawGraph(theNode)}>Coucou Pom</div>
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack)
