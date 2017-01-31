import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
//import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import drawChart from './bar'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class Bars100 extends React.Component {

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
    const numbers = data.numbers
    const labelGroup = data.string1Col
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    const isAnyNumbersLargerThan100 = numbers.find(num => num > 100)
    const domainMax = isAnyNumbersLargerThan100 ? Math.max.apply(null, numbers) : 100

    const scaleX = d3.scaleLinear()
    .domain([0, domainMax])
    .range([0, 100])

    const colors = this.props.colors
    const scaleColors = d3.scaleOrdinal()
    .domain(this.colorKeys)
    .range(colors)

    const dataChart = labelGroup.map((label, i) => ({
        group: label,
        value: [{
          title: isAnyNumbersLargerThan100 ?
            Math.round(scaleX(numbers[i])) + "% (" + numbers[i] + ")" :
            numbers[i] + "%",
          width: scaleX(numbers[i]),
          color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
        }]
      })
    )


    /* draw */
    drawChart(this.refs, dataChart, {hasGroupBgColor: true, colors})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bars100)
