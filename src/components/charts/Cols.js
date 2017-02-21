import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {uniqueArray} from '../../lib/array'
import {updateChartData} from '../../actions'
import {width, height, viewBox} from '../../data/config'
import {getDomainByDataRange} from '../axis/domain'
import drawChart from './col'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class Cols extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : data.keys
        onSelect(legendKeys, this.scale)
      }
    }

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        width: "calc(100% - " + (data.indent) + "px)",
        height: data.height + "%"
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const {data, colors, id} = this.props
    const numberRows = data.numberRows
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    // scale
    this.scale = {}
    this.scale.x0 = d3.scaleBand()
    .domain(labelGroup.map((d, i) => i))
    .rangeRound([0, width])

    // TODO: remove temp, use lables instead
    this.scale.x1 = d3.scaleBand()
    .domain(numberRows[0].map((d, i) => i))
    .rangeRound([0, this.scale.x0.bandwidth()])
    .paddingOuter([0.1])

    this.scale.y = d3.scaleLinear()
    .domain(getDomainByDataRange(data.numbers))
    .rangeRound([height, 0])

    const scaleScolors = d3.scaleOrdinal()
    .domain(this.colorKeys)
    .range(colors)

    // chart
    const dataChart = labelGroup.map((label, i) => ({
      transform: "translate(" + this.scale.x0(i) + ",0)",
      value: numberRows[i].map((num, j) => ({
        title: num,
        group: this.scale.x1(j),
        shift: num > 0 ? this.scale.y(num) : this.scale.y(0),
        length: Math.abs(this.scale.y(num) - this.scale.y(0)),
        color: colorGroup.length !== 0 ? scaleScolors(colorGroup[i]) : null
      }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, {width: this.scale.x1.bandwidth(), id, colors})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cols)
