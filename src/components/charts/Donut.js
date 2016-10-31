import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'

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
const radius = Math.min(width, height) / 2;

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


class Area extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate 1 */
    const els = this.refs

    const count = this.props.dataChart.count
    //console.log(count.col, count.row)
    if ((count.row !== 1 || count.col < 2 || count.col > 15) && (count.col !==2 || count.row < 2 || count.row > 15)) {
      d3.select("#donut")
      .classed("d-n", true)
      return
    } else {
      d3.select("#donut")
      .classed("d-n", false)
    }


    /* data */
    const dataNumbers = this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    /* validate 2 */
    const dataNumbersAll = [].concat.apply([], dataNumbers)
    const isAllPositive = dataNumbersAll.filter(num => num < 0).length === 0
    if (!isAllPositive) {
      d3.select("#donut")
      .classed("d-n", true)
      return
    }

    // TODO: labels of numbers
    const dataChart = dataNumbersAll
    //console.log(dataChart)

    const pie = d3.pie()
    .sort(null)
    .value(d => d)

    const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - radius*2/3)


    /* draw */

    // init area
    let svg = d3.select(els.pie)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("path")
    .data(pie(dataChart))

    // update
    svg
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])

    // new
    svg.enter().insert("path", ":first-child")
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])
    .attr("shape-rendering", "auto")

    // remove
    svg.exit().remove()
  }


  render() {
    return (
      <svg ref="svg">
        <g ref="pie"></g>
      </svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Area)
