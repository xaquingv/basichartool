import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {updateChartData} from '../../actions'
import {getDomainByDataRange} from './domain'
import drawChart from './col'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class ColStack extends React.Component {

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
      <svg ref="svg" onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const {data, width, colors, id} = this.props
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    const height = width*0.6
    const domain = getDomainByDataRange(numberRowSums)

    // scale
    this.scale = {}
    this.scale.x = d3.scaleBand()
    .domain(labelGroup)
    .rangeRound([0, width])
    .paddingInner(0.1)

    this.scale.y = d3.scaleLinear()
    .domain(domain)
    .rangeRound([height, 0])

    const dataChartGroup = labelGroup.map((date, i) => ({
      group: date,
      ...numberRows[i]
    }))

    // chart
    const stack = d3.stack().keys(Object.keys(numberRows[0]))
    const dataChart = stack(dataChartGroup).map((group, i) => ({
      color: colors[i],
      value: group.map((ns, j) => ({
        title: Math.round((ns[1] - ns[0])*100)/100,
        group: this.scale.x(labelGroup[j]),
        shift: domain[1] > 0 ? this.scale.y(ns[1]) : this.scale.y(ns[0]),
        length: Math.abs(this.scale.y(ns[0]) - this.scale.y(ns[1]))
      }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, {width: this.scale.x.bandwidth(), id, colors})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColStack)
