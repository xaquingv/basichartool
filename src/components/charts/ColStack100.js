import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'
import { getDomainByDataRange } from '../../data/calcScaleDomain'
import drawChart from './col'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class ColStack extends React.Component {
  appendChartData() {
    if (this.props.isSelected) {
      const { data, onSelect } = this.props
      onSelect(data.keys, this.scale)
    }
  }

  componentDidMount() {
    this.renderChart()
    this.appendChartData()
  }
  componentDidUpdate() {
    this.appendChartData()
    this.renderChart()
  }

  render() {
    const { data } = this.props

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none"
        style={{
          width: "calc(100% - " + (data.indent) + "px)",
          height: "calc(" + data.height + "% + 1px)"
        }}
      ></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, id } = this.props
    const { numberRows, numberRowSums, string1Col } = data
    const labelGroup = string1Col.length > 0 ? string1Col : data.dateCol
    const domain = getDomainByDataRange(numberRowSums)

    // scale
    this.scale = {}
    this.scale.y = d3.scaleLinear()
      .domain([0, 100])  // diff vs. ColStack
      .range([height, 0])

    // b/n label groups
    const scaleBand = d3.scaleBand()
      .domain(labelGroup)
      .range([0, width])
      .paddingInner(0.1)

    // chart
    const dataChartGroup = labelGroup.map((date, i) => ({
      group: date,
      ...numberRows[i].map(col => 100 * col/numberRowSums[i])  // diff vs. ColStack
    }))

    const stack = d3.stack().keys(Object.keys(numberRows[0]))
    const dataChart = stack(dataChartGroup).map((group, i) => ({
      color: colors[i],
      value: group.map((ns, j) => ({
        title: Math.round((ns[1] - ns[0]) * 100) / 100 + "% (" + numberRows[j][i] + ")",  // diff vs. ColStack
        group: scaleBand(labelGroup[j]),
        shift: domain[1] > 0 ? this.scale.y(ns[1]) : this.scale.y(ns[0]),
        length: Math.abs(this.scale.y(ns[0]) - this.scale.y(ns[1]))
      }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, { width: scaleBand.bandwidth(), id, colors })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColStack)
