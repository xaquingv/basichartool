import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendChartData} from '../../actions'
import {getDomainByDataRange} from '../../data/calcScaleDomain'
import ComponentRow from './BarBase'
import drawChart from './bar'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
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

    const isLabel = callByStep === 4
    return (
      <div className="canvas" ref="div" onClick={setChartData}>
        {data.string1Col.map((label, i) =>
        <ComponentRow isLabel={isLabel} label={label} key={i}/>
        )}
      </div>
    )
  }

  renderChart() {

    /* data */
    const {data, colors, callByStep} = this.props
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(getDomainByDataRange(numberRowSums))
    .range([0, 100])

    // chart
    const dataChart = numberRows.map((numRow, i) => ({
        value: numRow.map((num, j) => ({
          title: num,
          width: Math.abs(this.scale.x(num) - this.scale.x(0)),
          shift: (num < 0 && j===0) ? this.scale.x(numberRowSums[i]) : null
        }))
    }))


    /* draw */
    drawChart(this.refs, dataChart, {display: "inline-block", colors, callByStep})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarStack)
