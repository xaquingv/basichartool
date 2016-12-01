import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const width = 320
const height = width*0.6
const radius = Math.min(width, height) / 2;
const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Area extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

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
    const els = this.refs

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
