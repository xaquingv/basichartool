import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { uniqueArray } from '../../lib/array'
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


class Cols extends React.Component {
  appendChartData() {
    if (this.props.isSelected) { 
      const { data, onSelect } = this.props
      const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : data.keys
      onSelect(legendKeys, this.scale)
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
    const { data, colors, id, callByStep } = this.props
    const numberRows = data.numberRows
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    // scale
    this.scale = {}
    this.scale.y = d3.scaleLinear()
      .domain(getDomainByDataRange(data.numbers))
      .range([height, 0])
    // console.log("stack:", getDomainByDataRange(data.numbers))

    // b/n label groups
    const scaleBandGroups = d3.scaleBand()
      .domain(labelGroup.map((d, i) => i))
      .range([0, width])
      .paddingInner([0.1])

    // b/n colors in a group
    const scaleBandColors = d3.scaleBand()
      .domain(numberRows[0].map((d, i) => i))
      .range([0, scaleBandGroups.bandwidth()])
      .paddingInner([0.05])

    const scaleColors = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(colors)

    // chart
    const dataChart = labelGroup.map((label, i) => ({
      transform: "translate(" + scaleBandGroups(i) + ",0)",
      value: numberRows[i].map((num, j) => ({
        title: num,
        group: scaleBandColors(j),
        shift: num > 0 ? this.scale.y(num) : this.scale.y(0),
        length: Math.abs(this.scale.y(num) - this.scale.y(0)),
        color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
      }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, { width: scaleBandColors.bandwidth(), id, colors, callByStep })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cols)
