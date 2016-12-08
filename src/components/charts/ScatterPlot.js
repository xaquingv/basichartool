import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './plot'
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
    const data = this.props.dataChart.chart

    const names = data.string1Col
    const group = data.string2Col
    const colorGroup = []
    uniqueArray(group).forEach((d, i) => {
      colorGroup[d] = colors[i]
    })

    const numberCols = data.numberCols
    const numberRows = data.numberRows

    // TODO: overlap case
    // 1 px shift from center following the circle, degree divided by count
    // http://stackoverflow.com/questions/3436453/calculate-coordinates-of-a-regular-polygons-vertices
    //let count = {}
    //numberRows.forEach(n => { count["x"+n[0]+"y"+n[1]] = (count["x"+n[0]+"y"+n[1]] || 0 ) + 1 })
    //console.log(count)

    const dataChart = [numberRows.map((n, i) => {
      //const countOverlap = count["x"+n[0]+"y"+n[1]]
      //const isOverlapped = countOverlap > 1
      //if (isOverlapped) console.log(n[0], n[1], countOverlap)
      return {
        x: n[0],
        y: n[1],
        color: colorGroup[group[i]],
        title: names[i] + " [" + n[0] + ", " + n[1] + "]"//,
      }
    })]

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(numberCols[0]))
    .range([10, width - 10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(numberCols[1]))
    .range([height - 10, 10])


    /* draw */
    drawChart(this.refs, dataChart, scaleX, scaleY, "scatter")
  }


  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scatter)
