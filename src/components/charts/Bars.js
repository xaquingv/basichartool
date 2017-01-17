import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import drawChart from './bar'
import {getDomainByDataRange} from './domain'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => {
    dispatch(setupLegend(keys))
  }
})


class Bar extends React.Component {

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
      <div className="chart" ref="div" onClick={setLegendData}></div>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const numberRows = data.numberRows
    const labelGroup = data.string1Col
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    const scaleX = d3.scaleLinear()
    .domain(getDomainByDataRange(data.numbers))
    .range([0, 100])

    const scaleColors = d3.scaleOrdinal()
    .domain(this.colorKeys)
    .range(colors)

    const dataChart = labelGroup.map((label, i) => ({
      group: label,
      value: numberRows[i].map(num => ({
        title: num,
        width: Math.abs(scaleX(num) - scaleX(0)),
        shift: num > 0 ? scaleX(0) : scaleX(num),
        color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
      }))
    }))


    /* draw */
    const getBarHeight = (count) => Math.round((((24 - (count-1)) / 3) * 2) / count)
    const barHeight = getBarHeight(numberRows[0].length)

    drawChart(this.refs, dataChart, {barHeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
