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


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const count = this.props.dataChart.count
    const dataCols = this.props.dataChart.cols
    const dataGroup = dataCols[0].values
    const dataNumbers = swapArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const domain = d3.extent([].concat.apply([], dataNumbers))
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
      value: dataNumbers[i].map(num => ({
        title: num,
        width: Math.abs(scaleX(num) - scaleX(0)),
        shift: num > 0 ? scaleX(0) : scaleX(num)
      }))
    }))


    /* draw */
    const els = this.refs
    const scaleY = (count) => Math.round((((24 - (count-1)) / 3) * 2) / count)
    const barHeight = scaleY(count.number)

    drawPlot(els, dataChart, {barHeight})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
