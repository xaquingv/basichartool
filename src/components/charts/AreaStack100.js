import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { moveOneValueToTheFirstInArray, isValuesDifferentInArrays } from '../../lib/array'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'
import drawChart from './area'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors,
  drawingOrder: state.drawingOrder
})

const mapDispatchToProps = dispatch => ({
  onSelect: (legend, scale) => dispatch(appendChartData(legend, scale))
})


class Area100 extends React.Component {
  appendChartData() {
    const { data, drawingOrder, onSelect, callByStep } = this.props
    
    const indexPriority = drawingOrder.priority.index
    const legendPre = data.legend
    const legendCur = indexPriority ? moveOneValueToTheFirstInArray(data.keys, indexPriority) : data.keys
    const isLegendChange = isValuesDifferentInArrays(legendPre, legendCur)
    const isUpdate = /*callByStep 2*/ this.props.isSelected || (callByStep === 3 && isLegendChange)
    
    if (isUpdate) {
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
    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none"
        style={{
          top: "-1px",
          width: "calc(100% - " + (this.props.data.indent) + "px)",
          height: "100%"//data.height + "%"
        }}
      >
        <line ref="line" x1="0" x2="100%" y1="50%" y2="50%"></line> {/* diff vs. AreaStack */}
      </svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, drawingOrder } = this.props
    const { numberRows, numberRowSums } = data
    const dates = data.dateCol
    const domain = [0, 100] // diff vs. AreaStack

    // chart part 1/2
    const indexPriority = drawingOrder.priority.index
    const dataChartGroup = dates.map((date, index) => {
      // swap the priority index with 0 due to stack order option in step 2 question
      const row = indexPriority ? moveOneValueToTheFirstInArray(numberRows[index], indexPriority) : numberRows[index]
      return {
        date,
        ...row.map((n, i) => 100 * n / numberRowSums[index]) // diff vs. AreaStack, rescale to 100%
      }
    })

    let keys = Object.keys(dataChartGroup[0])
    keys.splice(keys.indexOf("date"), 1)

    const stack = d3.stack().keys(keys)
    const dataChart = stack(dataChartGroup)

    // scale
    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear

    this.scale = {}
    this.scale.x = scaleTime()
      .domain(d3.extent(dates))
      .range([0, width])

    this.scale.y = d3.scaleLinear()
      .domain(domain)
      .range([height, 0])

    // chart part 2/2
    const area = d3.area()
      .x( d => this.scale.x(d.data.date))
      .y0(d => this.scale.y(d[0]))
      .y1(d => this.scale.y(d[1]))


    /* draw */
    drawChart(this.refs, dataChart, area, colors)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Area100)
