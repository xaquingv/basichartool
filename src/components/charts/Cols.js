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
    if (count.col >= 2 && count.number >= 1 && count.row > 1) {
      d3.select("#cols")
      .classed("d-n", false)
    } else {
      d3.select("#cols")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const dataGroup = dataCols[0].values
    const dataNumbers = swapeArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const dataChart = dataGroup.map((date, i) => ({
      group: date,
      value: dataNumbers[i]
    }))


    /* draw */
    const scaleX0 = d3.scaleBand()
    .domain(dataGroup.map((d, i) => i))
    .rangeRound([10, width-10])

    const scaleX1 = d3.scaleBand()
    // TODO: remove temp, use lables instead
    .domain(dataNumbers[0].map((d, i) => i))
    .rangeRound([0, scaleX0.bandwidth()])
    .paddingOuter([0.1])

    const domain = d3.extent([].concat.apply([], dataNumbers))
    if (domain[0] > 0) {
      domain[0] = 0
    } else if (domain[1] < 0) {
      domain[1] = 0
    }

    const scaleY = d3.scaleLinear()
    .domain(domain)
    .rangeRound([height-10, 10])


    // init gs
    let gs =
    d3.select(els.svg)
    .selectAll("g")
    .data(dataChart)

    // update
    gs
    // TODO: double check
    .html("")
    .attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
    .selectAll("rect")
    .data(d => d.value)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX1(i))
    .attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
    .attr("width", scaleX1.bandwidth())
    .attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // new
    gs.enter().append("g")
    .attr("class", "group")
    .attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
    .selectAll("rect")
    .data(d => d.value)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX1(i))
    .attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
    .attr("width", scaleX1.bandwidth())
    .attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
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
