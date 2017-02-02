import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {updateChartData} from '../../actions'
import {getDomainByDataRange} from '../axis/domain'
import drawChart from './bar'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class BarStack extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) { onSelect(data.keys, this.scale) }
    }

    return (
      <div className="chart" ref="div" onClick={setChartData}></div>
    )
  }

  renderChart() {

    /* data */
    const {data, colors} = this.props
    const labelGroup = data.string1Col
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(getDomainByDataRange(numberRowSums))
    .range([0, 100])

    // chart
    const dataChart = labelGroup.map((group, i) => ({
        group: group,
        value: numberRows[i].map((num, j) => ({
          title: num,
          width: Math.abs(this.scale.x(num) - this.scale.x(0)),
          shift: (num < 0 && j===0) ? this.scale.x(numberRowSums[i]) : null
        }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, {display: "inline-block", colors})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack)
