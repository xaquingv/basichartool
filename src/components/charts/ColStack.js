import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapeArray} from '../../lib/array'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const width = 320;
const height = 320*0.6;

const colors = [
    "#4dc6dd",  // blue light
    "#005789",  // blue dark
    "#fcdd03",  // yellow
    "#ff9b0b",  // orange light
    "#ea6911",  // orange dark
    "#dfdfdf",  // grey 5
    "#bdbdbd",  // grey 3
    "#808080",  // grey 1.5
    "#aad801",  // green
    "#000000"   // custom color
];

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Col extends React.Component {
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.col >= 3 && count.number >= 2 && count.row > 2) {
      d3.select("#colStack")
      .classed("d-n", false)
    } else {
      d3.select("#colStack")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const dataGroup = dataCols[0].values
    const dataNumbers = swapeArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const dataNumbersAll = [].concat.apply([], dataNumbers)
    const dataNumberSums = dataNumbers.map(ns => ns.reduce((n1, n2) => n1 + n2))

    /* validate 2 */
    const isAllPositiveOrNegative =
      dataNumbersAll.filter(num => num < 0).length === 0 ||
      dataNumbersAll.filter(num => num > 0).length === 0

    if (!isAllPositiveOrNegative) {
      d3.select("#colStack")
      .classed("d-n", true)
      return
    }

    const dataChart = dataGroup.map((date, i) => ({
      group: date,
      ...dataNumbers[i]
    }))
    const stack = d3.stack().keys(Object.keys(dataNumbers[0]))

    //console.log("g:", dataGroup)
    //console.log("n:", dataNumbers)
    //console.log(dataNumbers.map(ns => ns.reduce((n1, n2) => n1+n2)))
    //console.log(stack(dataChart))


    /* draw */
    const scaleX = d3.scaleBand()
    .domain(dataGroup)
    .rangeRound([10, width-10])
    .paddingInner(0.1)

    const domain = d3.extent(dataNumberSums)
    if (domain[0] > 0) {
      domain[0] = 0
    } else if (domain[1] < 0) {
      domain[1] = 0
    }
    //console.log(domain)

    const scaleY = d3.scaleLinear()
    //.domain([0, Math.max.apply(null, dataNumbers.map(ns => ns.reduce((n1, n2) => n1 + n2)))])
    .domain(domain)
    .rangeRound([height-10, 10])

    // init gs
    let gs =
    d3.select(els.svg)
    .selectAll("g")
    .data(stack(dataChart))

    // update
    gs
    // TODO: double check
    .html("")
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX(dataGroup[i]))
    .attr("y", d => domain[1] > 0 ? scaleY(d[1]) : scaleY(d[0]))
    .attr("width", scaleX.bandwidth())
    .attr("height", d => Math.abs(scaleY(d[0]) - scaleY(d[1])))
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // new
    gs.enter().append("g")
    .attr("class", "group")
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX(dataGroup[i]))
    .attr("y", d => domain[1] > 0 ? scaleY(d[1]) : scaleY(d[0]))
    .attr("width", scaleX.bandwidth())
    .attr("height", d => Math.abs(scaleY(d[0]) - scaleY(d[1])))
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // remove
    gs.exit().remove()
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Col)
