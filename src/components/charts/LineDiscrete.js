import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import drawChart from './line'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: repeat accepted
  - number*: any range, min 3
*/

const width = 320;
const height = width*0.6;

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Line extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){
    
    /* data */
    const data = this.props.dataChart
    const dataChart = data.numberCols.map(numberCol =>
      numberCol.map((number, i) => ({
        date: i,
        number: number
    })))

    const scaleX = d3.scaleLinear()
    .domain([0, data.rowCount - 1])
    .range([10, width - 10])

    const scaleY = d3.scaleLinear()
    // TODO: pretty domain
    .domain(d3.extent(data.numbers))
    .range([height - 10, 10])


    /* draw */
    drawChart(this.refs, dataChart, scaleX, scaleY)
  }

  render() {
    return (
      <svg ref="svg"></svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Line)
