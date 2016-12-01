import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawLine} from './line'
import {drawPlot} from './plot'
import {uniqueArray} from '../../lib/array'

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
    /* validate */
    const els = this.refs

    const dataCols = this.props.dataChart.cols
    const iDate = dataCols.map(d => d.type).indexOf("date")
    const hasRepeatDateValue = iDate > -1 ? dataCols[iDate].hasRepeatValue : null

    const count = this.props.dataChart.count
    if (count.date === 1 && count.number > 0 && count.row >= 2 && (count.row < 100 || (count.row >= 100 && hasRepeatDateValue))) {
      d3.select("#lineContiPlot")
      .classed("d-n", false)
    }
    else{
      d3.select("#lineContiPlot")
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

    const strs = dataCols[iDate].string
    const mapping = uniqueArray(strs).map(date =>
      strs.map((val, ind) => ({val, ind}))
          .filter(d => d.val === date)
          .map(d => d.ind)
    )
    const getDataChartLine = () =>
      dataNumbers.map(numberCol =>
        mapping.map(list => ({
          date: dataDates[list[0]],
          number: list.map(i => numberCol[i]).reduce((n1, n2) => n1 + n2) / list.length //avg
        }))
      )
    const dataChartLine = hasRepeatDateValue ? getDataChartLine() : dataChart


    /* draw */
    // line(s)
    const scaleTime = dataCols[iDate].hasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dataDates))
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([height-10, 10])

    drawPlot(els, dataChart, scaleX, scaleY, "line")
    drawLine(els, dataChartLine, scaleX, scaleY)

    // circles (plot)
    //drawPlot(els, dataChart, scaleX, scaleY, "line")
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
