import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapeArray} from '../../lib/array'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const barHeight = 16
const bodyHeight = 4
const bodyTop = (barHeight - bodyHeight) / 2
const headSize = 12
const headTop = (barHeight - headSize) / 2
const marginBottom = 8
const bgColor = "#f6f6f6"
const dotColors = ["#4dc6dd", "#005789"]

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Bar extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if ((count.date === 1 || count.string === 1) && count.number === 2 && count.col === 3 && count.row < 25) {
      d3.select("#tickOnBar")
      .classed("d-n", false)
    } else {
      d3.select("#tickOnBar")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    // const dataDates
    const dataNumbers = swapeArray(dataCols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    //console.log(dataNumbers)
    const domain = d3.extent([].concat.apply([], dataNumbers))
    //console.log(domain)
    const scaleX = d3.scaleLinear()
    .domain(domain)
    .range([0, 100])

    //TODO: check ticks on top of each other
    const dataChart = dataNumbers.map((ns, i) => ({
      value: ns,
      width: Math.abs(scaleX(ns[1]) - scaleX(ns[0])),
      shift: scaleX(Math.min(ns[0], ns[1]))//,
    }))
    //console.log(dataChart)


    /* draw */
    let gs = d3.select(els.div)
    // TODO: remove temp solution
    .html("")
    .selectAll(".group")
    .data(dataChart/*Arrow*/)

    gs.enter().append("div")
    .attr("class", "group")
    .attr("title", d => d.value)
    .style("height", barHeight + "px")
    .style("margin-bottom", marginBottom + "px")
    .style("position", "relative")
    .style("background-color", bgColor)
    .selectAll("div")
    .data(d => d.value)
    .enter().append("div")
    .style("width", "6px")
    .style("height", "16px")
    .style("border-radius", "2px")
    .style("background-color", (d, i) => dotColors[i])
    .style("position", "absolute")
    //.style("top", "3px")
    .style("left", d => "calc(" + scaleX(d) + "% - 3px)")
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
