import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { uniqueArray } from '../../lib/array'
import { appendChartData } from '../../actions'
import { getDomainByDataRange } from '../../data/calcScaleDomain'
import ComponentRow from './BarBase'
import drawChart from './bar'

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale) => dispatch(appendChartData(data, keys, scale))
})


class Bars extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const { data, onSelect, callByStep } = this.props
    // step 2: Discover
    const setChartData = () => {
      if (callByStep === 2) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : data.keys
        onSelect(data, legendKeys, this.scale)
      }
    }
    // step 3: Edit
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
    const { data, colors, callByStep } = this.props
    const numberRows = data.numberRows
    const colorGroup = data.string2Col
    this.colorKeys = uniqueArray(colorGroup)

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
      .domain(getDomainByDataRange(data.numbers))
      .range([0, 100])

    const scaleColors = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(colors)

    // chart
    const dataChart = numberRows.map((numRow, i) => ({
      value: numRow.map(num => ({
        title: num,
        width: Math.abs(this.scale.x(num) - this.scale.x(0)),
        shift: num > 0 ? this.scale.x(0) : this.scale.x(num),
        color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
      }))
    }))


    /* draw */
    const getBarHeight = (count) => Math.round((((24 - (count - 1)) / 3) * 2) / count)
    const barHeight = getBarHeight(numberRows[0].length)

    drawChart(this.refs, dataChart, { barHeight, colors, callByStep })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bars)
