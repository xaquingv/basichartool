import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './bar'
import {getDomainByDataRange} from './domain'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class BarStack extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const groups = data.string1Col
    const numberRows = data.numberRows

    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    const scaleX = d3.scaleLinear()
    .domain(getDomainByDataRange(numberRowSums))
    .range([0, 100])

    const dataChart = groups.map((group, i) => ({
        group: group,
        value: numberRows[i].map((num, j) => ({
          title: num,
          width: Math.abs(scaleX(num) - scaleX(0)),
          shift: (num < 0 && j===0) ? scaleX(numberRowSums[i]) : null
        }))
    }))

    /* draw */
    drawChart(this.refs, dataChart, {display: "inline-block"})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack)
