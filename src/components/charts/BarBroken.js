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

//const width = 320;
//const height = 320*0.6;

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


class Bar extends React.Component {
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate 1 */
    const els = this.refs

    const count = this.props.dataChart.count
    if ((count.col === 2 || count.row === 1) && count.date === 0) {
      d3.select("#barBroken")
      .classed("d-n", false)
    } else {
      d3.select("#barBroken")
      .classed("d-n", true)
      return
    }


    /* data */
    //const dataCols = this.props.dataChart.cols
    //const dataGroup = dataCols[0].values
    const dataNumbers = swapeArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    /* validate 2 * /
    // NOTE: round to aviod system number digit issue
    const dataNumberSums = dataNumbers.map(ns => Math.round(ns.reduce((n1, n2) => n1 + n2)*100)/100)
    const isAll100 = dataNumberSums.filter(sum => sum === 100).length === dataNumberSums.length
    if (isAll100) {
      d3.select("#barStack100")
      .classed("d-n", true)
      return
    }
    //console.log(dataNumberSums)

    const scaleX = (i) => d3.scaleLinear()
    .domain([0, dataNumberSums[i]])
    .range([0, 100])

    const dataChart = dataGroup.map((group, i) => {
      let scale = scaleX(i)
      return {
        group: group,
        value: dataNumbers[i].map(num => ({
          title: num,
          width: scale(num)
        }))
      }
    })
    console.log(dataNumbers)*/

    /* validate 2 */
    const dataNumbersAll = [].concat.apply([], dataNumbers)
    const isAllPositive = dataNumbersAll.filter(num => num < 0).length === 0
    if (!isAllPositive) {
      d3.select("#barBroken")
      .classed("d-n", true)
      return
    }

    const dataChart = dataNumbersAll
    //console.log(dataChart)

    /* draw */
    const scaleX = d3.scaleLinear()
    .domain([0, dataChart.reduce((n1, n2) => n1 + n2)])
    .range([0, 100])

    // init gs
    // TODO: multi broken bars
    //let gs =
    let div =
    d3.select(els.div)
    .style("padding-top", 48 + 10 + "px") // override
    .selectAll("div")
    .data(dataChart/*.slice(0, 1)*/)

    // update
    /*gs
    // TODO: double check
    .html("")
    .selectAll("div")
    .data(d => d.value)
    .enter().append("div")*/
    div
    .attr("title", d => d)
    .style("width", d => scaleX(d) + "%")
    .style("height", "72px")
    .style("display", "inline-block")
    .style("background-color", (d, i) => d ? colors[i] : "transparent")

    // new
    /*gs.enter().append("div")
    .attr("class", "group")
    .style("margin-top", "48px")
    .selectAll("div")
    .data((d, i) => d.value)*/
    div
    .enter().append("div")
    .attr("title", d => d)
    .style("width", d => scaleX(d) + "%")
    .style("height", "72px")
    .style("display", "inline-block")
    .style("background-color", (d, i) => d ? colors[i] : "transparent")

    // remove
    div/*gs*/.exit().remove()
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
