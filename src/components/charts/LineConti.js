import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawLine} from './line'

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
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Line extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const dataCols = this.props.dataChart.cols
    const iDate = dataCols.map(d => d.type).indexOf("date")

    const dataDates = dataCols[iDate].values
    const dataNumbers = this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    const dataChart = dataNumbers.map(numberCol =>
      numberCol.map((number, i) => ({
        date: dataDates[i],
        number: number
    })))


    /* draw */
    const els = this.refs

    const scaleTime = dataCols[iDate].hasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dataDates))
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawLine(els, dataChart, scaleX, scaleY)


    /* validate 2 */
    // TODO: move out if possible
    // NOTE: special validation to double check if discrete and conti are the same
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
