import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './bar'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class BarStack100 extends React.Component {

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
        <div className="chart" ref="div" onClick={setLegendData}></div>
      )
    }

    renderChart() {

    /* data */
    const data = this.props.dataChart
    const groups = data.string1Col
    const numberRows = data.numberRows
    const colors = this.props.colors

    const numberRowSums = numberRows.map(ns => Math.round(ns.reduce((n1, n2) => n1 + n2)*100)/100)
    const scaleX = (i) => d3.scaleLinear()
    .domain([0, numberRowSums[i]])
    .range([0, 100])

    const dataChart = groups.map((group, i) => {
      const scale = scaleX(i)
      return {
        group: group,
        value: numberRows[i].map(num => ({
          title: Math.round(scale(num)) + "% (" + num + ")",
          width: scale(num)
        }))
      }
    })

    /* draw */
    drawChart(this.refs, dataChart, {display: "inline-block", colors})

    /* validate special */
    // TODO: move to another validatetion file
    // TODO: remove barGStack or barGStack100 ?
    // NOTE: check if BarStack100 and BarStack is duplicate
    const isDuplicate = !numberRowSums.find(sum => sum !== 100)
    if (isDuplicate) {
      d3.select("#barGStack100").classed("d-n", true)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack100)
