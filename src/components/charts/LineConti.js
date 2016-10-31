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
const height = 320*0.6;

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Line extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate 1 */
    const els = this.refs

    const dataCols = this.props.dataChart.cols
    const iDate = dataCols.map(d => d.type).indexOf("date")
    const hasRepeatDateValue = iDate > -1 ? dataCols[iDate].hasRepeatValue : null

    const count = this.props.dataChart.count
    if (count.date === 1 && count.number > 0 && count.row > 2 && !hasRepeatDateValue) {
      //console.log("line conti")
      d3.select("#lineConti")
      .classed("d-n", false)
    }
    else{
      d3.select("#lineConti")
      .classed("d-n", true)
      return
    }


    /* data */
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
    //const scaleTime =
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
