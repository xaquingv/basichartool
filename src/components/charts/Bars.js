import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import drawChart from './bar'
import {getDomainByDataRange} from './domain'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const mapStateToProps = (state) => ({
  stepUser: state.step,
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {
  /* update controls */
  componentDidMount() {
    if (this.props.isUpdate) this.setState({kickUpdate: true})
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isSelected && nextProps.stepUser === nextProps.stepCall
  }

  componentDidUpdate(){

    /* data */
    const data = this.props.dataChart
    const numberRows = data.numberRows
    const labelGroup = data.string1Col
    const colorGroup = data.string2Col

    const scaleX = d3.scaleLinear()
    .domain(getDomainByDataRange(data.numbers))
    .range([0, 100])

    const scaleColors = d3.scaleOrdinal()
    .domain(uniqueArray(colorGroup))
    .range(colors)

    const dataChart = labelGroup.map((label, i) => ({
      group: label,
      value: numberRows[i].map(num => ({
        title: num,
        width: Math.abs(scaleX(num) - scaleX(0)),
        shift: num > 0 ? scaleX(0) : scaleX(num),
        color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
      }))
    }))


    /* draw */
    const getBarHeight = (count) => Math.round((((24 - (count-1)) / 3) * 2) / count)
    const barHeight = getBarHeight(numberRows[0].length)

    drawChart(this.refs, dataChart, {barHeight})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
