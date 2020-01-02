import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { moveOneValueToTheFirstInArray } from '../../lib/array'
import { appendChartData } from '../../actions'
import { getDomainByDataRange } from '../../data/calcScaleDomain'
import ComponentRow from './BarBase'
import drawChart from './bar'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors,
  drawingOrder: state.drawingOrder
})

const mapDispatchToProps = dispatch => ({
  onSelect: (legend, scale) => dispatch(appendChartData(legend, scale))
})


class BarStack extends React.Component {
  appendChartData() {
    const { data, drawingOrder, onSelect } = this.props
    
    const indexPriority = drawingOrder.priority.index
    const legendPre = data.legend
    const legendCur = indexPriority ? moveOneValueToTheFirstInArray(data.keys, indexPriority) : data.keys
    const isLegendChange = legendCur.some((cur, i) => cur !== legendPre[i])
    
    if (isLegendChange) {
      onSelect(legendCur, this.scale)
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
    const { data, onSelect, callByStep } = this.props
    // step 2: Discover
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, data.keys, this.scale) }
    }
    // step 3: Edits
    const isLabel = callByStep === 3
    return (
      <div className="canvas" ref="div" onClick={setChartData}>
        {data.string1Col.map((label, i) =>
          <ComponentRow isLabel={isLabel} label={label} key={i} />
        )}
      </div>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, drawingOrder, callByStep } = this.props
    const { numberRows, numberRowSums } = data

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
      .domain(getDomainByDataRange(numberRowSums))
      .range([0, 100])

    // chart
    const indexPriority = drawingOrder.priority.index
    const dataChart = numberRows.map((numRow, i) => {
      const row = indexPriority ? moveOneValueToTheFirstInArray(numRow, indexPriority) : numRow
      return {
      value: row.map((num, j) => ({
        title: num,
        width: Math.abs(this.scale.x(num) - this.scale.x(0)),
        shift: (num < 0 && j === 0) ? this.scale.x(numberRowSums[i]) : null
      }))
    }})


    /* draw */
    drawChart(this.refs, dataChart, { display: "inline-block", colors, callByStep })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack)
