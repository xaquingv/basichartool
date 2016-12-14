import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {uniqueArray} from '../../lib/array'
import drawChart from './bar'

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
    const numbers = data.numbers
    const labelGroup = data.string1Col
    const colorGroup = data.string2Col

    const isAnyNumbersLargerThan100 = numbers.find(num => num > 100)
    const domainMax = isAnyNumbersLargerThan100 ? Math.max.apply(null, numbers) : 100

    const scaleX = d3.scaleLinear()
    .domain([0, domainMax])
    .range([0, 100])

    const scaleColors = d3.scaleOrdinal()
    .domain(uniqueArray(colorGroup))
    .range(colors)

    const dataChart = labelGroup.map((label, i) => ({
        group: label,
        value: [{
          title: isAnyNumbersLargerThan100 ?
            Math.round(scaleX(numbers[i])) + "% (" + numbers[i] + ")" :
            numbers[i] + "%",
          width: scaleX(numbers[i]),
          color: colorGroup.length !== 0 ? scaleColors(colorGroup[i]) : null
        }]
      })
    )


    /* draw */
    drawChart(this.refs, dataChart, {hasGroupBgColor: true})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
