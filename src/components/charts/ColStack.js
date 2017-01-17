import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {col as drawChart} from './col'
import {getDomainByDataRange} from './domain'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class ColStack extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {callByStep, dataChart, onSelect} = this.props

    const setLegendData = () => {
      if (callByStep === 3) { onSelect(dataChart.keys) }
    }

    return (
      <svg ref="svg" onClick={setLegendData}></svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    const width = this.props.width
    const height = width*0.6

    const scaleX = d3.scaleBand()
    .domain(labelGroup)
    .rangeRound([0, width])
    .paddingInner(0.1)

    const domain = getDomainByDataRange(numberRowSums)
    const scaleY = d3.scaleLinear()
    .domain(domain)
    .rangeRound([height, 0])

    const dataChartGroup = labelGroup.map((date, i) => ({
      group: date,
      ...numberRows[i]
    }))
    const stack = d3.stack().keys(Object.keys(numberRows[0]))
    const dataChart = stack(dataChartGroup).map((group, i) => ({
      color: colors[i],
      value: group.map((ns, j) => ({
        title: Math.round((ns[1] - ns[0])*100)/100,
        group: scaleX(labelGroup[j]),
        shift: domain[1] > 0 ? scaleY(ns[1]) : scaleY(ns[0]),
        length: Math.abs(scaleY(ns[0]) - scaleY(ns[1]))
      }))
    }))

    /* draw */
    drawChart(this.refs, dataChart, {width: scaleX.bandwidth(), id: this.props.id})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColStack)
