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
      d3.select("#arrowOnBar")
      .classed("d-n", false)
    } else {
      d3.select("#arrowOnBar")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    // const dataDates
    const dataNumbers = swapeArray(dataCols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const scaleX = d3.scaleLinear()
    .domain(d3.extent([].concat.apply([], dataNumbers)))
    .range([0, 100])

    const getArrowData = (d) => {
      switch (true) {
        case d.value[1] - d.value[0] > 0:
          // increase, right
          return {
            color: "#4dc6dd",
            bodyLeft: d.shift + "%",
            headLeft: "calc(" + (d.shift + d.width) + "% - " + headSize + "px)",
            borderWidths: "6px 0 6px 12px",
            borderColors: "transparent #4dc6dd"
            // TODO: shift for arrow body
          }
        // decrease, left
        case d.value[1] - d.value[0] < 0:
          return {
            color: "#005789",
            bodyLeft: "calc(" + d.shift + "% + " + headSize/2 + "px)",
            headLeft: d.shift + "%",
            borderWidths: "6px 12px 6px 0",
            borderColors: "transparent #005789"
          }
        // even
        default:
          return {
            color: "#dfdfdf",
            bodyLeft: d.shift + "%", // arrow body left
            headLeft: "calc(" + d.shift + "% - " + headSize/2 + "px)", // arrow head left
            borderWidths: headSize/2 + "px",
            borderColors: "#dfdfdf"
          }
      }
    }

    const dataChart = dataNumbers.map((ns, i) => ({
      value: ns,
      width: Math.abs(scaleX(ns[1]) - scaleX(ns[0])),
      shift: scaleX(Math.min(ns[0], ns[1]))//,
      //arrow: getArrowDirection(ns)
    }))

    const dataChartArrow = dataChart.map(d => ({
      width: d.width, ...getArrowData(d)
    }))


    /* draw */
    let gs, g
    gs = d3.select(els.div)
    // TODO: remove temp solution
    .html("")
    .selectAll(".group")
    .data(dataChartArrow)

    // update
    /*gu = gs
    .html("")
    .selectAll("div")
    .data(d => [d])
    .enter()

    gu.append("div")
    .style("width", d => "calc(" + d.width + "% - " + headSize/2 + "px)")
    .style("left", d => d.bodyLeft)
    .style("background-color", d => d.color)
    */

    // new
    g = gs.enter().append("div")
    .attr("class", "group")
    .attr("title", d => d.value)
    .style("height", barHeight + "px")
    .style("margin-bottom", marginBottom + "px")
    .style("position", "relative")
    .style("background-color", bgColor)
    .selectAll("div")
    .data(d => [d])
    .enter()

    // arrow - body
    g.append("div")
    .attr("class", "arrow-body")
    .style("width", d => "calc(" + d.width + "% - " + headSize/2 + "px)")
    .style("height", bodyHeight + "px")
    .style("position", "absolute")
    .style("top", bodyTop + "px")
    .style("left", d => d.bodyLeft)
    .style("background-color", d => d.color)
    // arrow - head
    g.append("div")
    .attr("class", "arrow-head")
    .style("position", "absolute")
    .style("top", headTop + "px")
    .style("left", d => d.headLeft)
    .style("border-width", d => d.borderWidths)
    .style("border-color", d => d.borderColors)
    .style("border-style", "solid")

    // remove
    //gs.exit().remove()
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
