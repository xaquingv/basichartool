import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawPlot} from './plot'
import {uniqueArray} from '../../lib/array'
import {colors} from '../../data/config'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: repeat accepted
  - number*: any range, min 3
*/

const width = 320
const height = width*0.6

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Scatter extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

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
    //console.log(dataNumbers)
    const dataChart = dataGroup.map((group, i) => {

    return {
        group: group,
        color: groupColors[group],
        value: [dataNumbers[0][i], dataNumbers[1][i]],
        // TODO change keys below
        date: dataNumbers[0][i],
        number: dataNumbers[1][i]
    }})
    //console.log(dataChart)

    /* draw */
    const els = this.refs

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
