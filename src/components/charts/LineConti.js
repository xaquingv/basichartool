import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './line'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const width = 320;
const height = width*0.6;

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Line extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const data = this.props.dataChart
    const dates = data.dateCol
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        date: dates[i],
        number: number
    })))

    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dates))
    .range([10, width - 10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(data.numbers))
    .range([height - 10, 10])


    /* draw */
    drawChart(this.refs, dataChart, scaleX, scaleY)


    /* validate special */
    // TODO: move to another validatetion file
    // NOTE: double check if discrete and conti are the same
    // if the same (duplicate), hide the discrete line
    const elLineDiscrete = d3.select("#lineDiscrete")
    if (d3.select("#lineConti path").attr("d") === elLineDiscrete.select("path").attr("d")) {
      elLineDiscrete.classed("d-n", true)
    }
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
