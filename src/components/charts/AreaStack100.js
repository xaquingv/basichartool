import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'

/*
  data spec
  missing data accepted
  cols [2, many]
  - date: repeat is allowed
  - number: all positive
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


class Line extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.date !== 1 || count.number < 2 || count.row < 3) {
      d3.select(els.svg)
      .classed("d-n", true)
      console.log("no line")
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const types = dataCols.map(d => d.type)

    const dataDates = dataCols[types.indexOf("date")].values
    const dataNumbers = this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)

    const dataChart = dataDates.map((date, i) => {
      const nums = dataNumbers.map(numbers => numbers[i])
      return {date, ...nums}
    })

    let keys = Object.keys(dataChart[0])
    keys.splice(keys.indexOf("date"), 1)

    const stack = d3.stack().keys(keys)
    // TODO: stack data not 100%? extend to 100%
    //const dataChartStack = stack(dataChart)
    //console.log(dataChart)
    //console.log(dataChartStack)


    /* draw */
    const scaleX = d3.scaleTime()
    .domain(d3.extent(dataDates))
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    .domain([0, 100])
    .range([height-10, 10])

    const area = d3.area()
    .x((d, i) => scaleX(d.data.date))
    .y0((d) => scaleY(d[0]))
    .y1((d) => scaleY(d[1]))

    // init area
    let svg = d3.select(els.svg)
    .classed("d-n", false)
    .selectAll("path")
    .data(stack(dataChart))

    // update
    svg
    .attr("d", d => area(d))

    // new
    svg.enter().insert("path", ":first-child")
    .attr("fill", (d, i) => colors[i])
    .attr("fill-opacity", .75)
    .attr("shape-rendering", "auto")
    .attr("d", d => area(d))

    // remove
    svg.exit().remove()

    // 50% line
    d3.select(els.line)
    .attr("fill-opacity", 1)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5, 5")
  }


  render() {
    return (
      <svg ref="svg">
        <line ref="line" x1="0" x2="100%" y1="50%" y2="50%"></line>
      </svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
