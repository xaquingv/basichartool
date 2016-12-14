import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './bar'

/*
  data spec
  no missing data
  cols [4, many]
  - string: no-repeat
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
    const groups = data.string1Col
    const numberRows = data.numberRows

    const numberRowSums = numberRows.map(ns => Math.round(ns.reduce((n1, n2) => n1 + n2)*100)/100)
    const scaleX = (i) => d3.scaleLinear()
    .domain([0, numberRowSums[i]])
    .range([0, 100])

    const dataChart = groups.map((group, i) => {
      const scale = scaleX(i)
      return {
        group: group,
        value: numberRows[i].map(num => ({
          title: Math.round(scale(num)) + "% (" + num + ")",
          width: scale(num)
        }))
      }
    })

    /* draw */
    drawChart(this.refs, dataChart, {display: "inline-block"})

    /* validate special */
    // TODO: move to another validatetion file
    // TODO: remove barGStack or barGStack100 ?
    // NOTE: check if BarStack100 and BarStack is duplicate
    const isDuplicate = !numberRowSums.find(sum => sum !== 100)
    if (isDuplicate) {
      d3.select("#barGStack100").classed("d-n", true)
    }
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
