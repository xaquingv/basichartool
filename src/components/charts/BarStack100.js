import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { appendChartData } from '../../actions'
import ComponentRow from './BarBase'
import drawChart from './bar'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class BarStack100 extends React.Component {
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
    const { data, colors, callByStep } = this.props
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => Math.round(ns.reduce((n1, n2) => n1 + n2) * 100) / 100)
    console.log("row:", numberRowSums)

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()         // scale of axis
      .range([0, 100])

    const scaleX = (i) => d3.scaleLinear()  // scale of bars
      .domain([0, numberRowSums[i]])
      .range([0, 100])

    // chart
    const dataChart = numberRows.map((numRow, i) => {
      const scale = scaleX(i)
      return {
        value: numRow.map(num => ({
          title: Math.round(scale(num)) + "% (" + num + ")",
          width: scale(num)
        }))
      }
    })


    /* draw */
    drawChart(this.refs, dataChart, { display: "inline-block", colors, callByStep })


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
