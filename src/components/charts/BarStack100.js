import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { moveOneValueToTheFirstInArray } from '../../lib/array'
import { appendChartData } from '../../actions'
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


class BarStack100 extends React.Component {
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
    const { data, callByStep } = this.props
    const isLabel = callByStep === 3
    
    return (
      <div className="canvas" ref="div">
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
    this.scale.x = d3.scaleLinear()         // scale of axis
      .range([0, 100])

    const scaleX = (i) => d3.scaleLinear()  // scale of bars
      .domain([0, numberRowSums[i]])
      .range([0, 100])

    // chart
    const indexPriority = drawingOrder.priority.index
    const dataChart = numberRows.map((numRow, i) => {
      const row = indexPriority ? moveOneValueToTheFirstInArray(numRow, indexPriority) : numRow
      const scale = scaleX(i)
      return {
        value: row.map(num => ({
          title: Math.round(scale(num)) + "% (" + num + ")",
          width: scale(num)
        }))
      }
    })


    /* draw */
    drawChart(this.refs, dataChart, { display: "inline-block", colors, callByStep })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack100)
