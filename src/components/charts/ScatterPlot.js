import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawPlot} from './plot'
import {uniqueArray} from '../../lib/array'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: repeat accepted
  - number*: any range, min 3
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


class Scatter extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    //TODO: add string || date
    const count = this.props.dataChart.count
    if ((count.date === 0 && count.number >= 2) && count.row > 2) {
      d3.select("#scatterPlot")
      .classed("d-n", false)
    } else {
      d3.select("#scatterPlot")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const dataTypes = dataCols.map(d => d.type)
    const dataGroup = dataCols[dataTypes.indexOf("string")].values // first string
    const groupUnique = uniqueArray(dataGroup)
    const groupColors = []
    groupUnique.forEach((d, i) => {
      groupColors[d] = colors[i]
    })
    console.log("colors:", groupColors)

    const dataNumbers = this.props.dataChart.cols // fisrt two numbers
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values)
    console.log(dataNumbers)
    const dataChart = dataGroup.map((group, i) => {

    return {
        group: group,
        color: groupColors[group],
        value: [dataNumbers[0][i], dataNumbers[1][i]],
        // TODO change keys below
        date: dataNumbers[0][i],
        number: dataNumbers[1][i]
    }})
    console.log(dataChart)

    /* draw */
    //const scaleTime = dataCols[types.indexOf("date")].hasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = d3.scaleLinear()
    .domain(d3.extent(dataNumbers[0]))
    .range([10, width-10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(dataNumbers[1]))
    .range([height-10, 10])

    drawPlot(els, [dataChart], scaleX, scaleY, "scatter")
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scatter)
