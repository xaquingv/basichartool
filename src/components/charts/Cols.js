import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import {col as drawChart} from './col'
import {getDomainByDataRange} from './domain'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class Cols extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {callByStep, dataChart, onSelect} = this.props

    const setLegendData = () => {
      if (callByStep === 3) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : dataChart.keys
        onSelect(legendKeys)
      }
    }

    return (
      <svg ref="svg" onClick={setLegendData}></svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const numberRows = data.numberRows
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    const width = this.props.width
    const height = width*0.6

    let scale = {}
    scale.x0 = d3.scaleBand()
    .domain(labelGroup.map((d, i) => i))
    .rangeRound([0, width])

    scale.x1 = d3.scaleBand()
    // TODO: remove temp, use lables instead
    .domain(numberRows[0].map((d, i) => i))
    .rangeRound([0, scale.x0.bandwidth()])
    .paddingOuter([0.1])

    scale.y = d3.scaleLinear()
    .domain(getDomainByDataRange(data.numbers))
    .rangeRound([height, 0])

    scale.colors = d3.scaleOrdinal()
    .domain(this.colorKeys)
    .range(colors)

    const dataChart = labelGroup.map((label, i) => ({
      transform: "translate(" + scale.x0(i) + ",0)",
      value: numberRows[i].map((num, j) => ({
        title: num,
        group: scale.x1(j),
        shift: num > 0 ? scale.y(num) : scale.y(0),
        length: Math.abs(scale.y(num) - scale.y(0)),
        color: colorGroup.length !== 0 ? scale.colors(colorGroup[i]) : null
      }))
    }))

    /* draw */
    drawChart(this.refs, dataChart, {width: scale.x1.bandwidth(), id: this.props.id})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cols)
