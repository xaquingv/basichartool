import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapArray} from '../../lib/array'
import {colors} from '../../data/config'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const dataNumbers = swapArray(this.props.dataChart.cols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    const dataChart = [].concat.apply([], dataNumbers)


    /* draw */
    const els = this.refs

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
    div
    .attr("title", d => d)
    .style("width", d => scaleX(d) + "%")
    .style("height", "72px")
    .style("display", "inline-block")
    .style("background-color", (d, i) => d ? colors[i] : "transparent")

    div
    .enter().append("div")
    .attr("title", d => d)
    .style("width", d => scaleX(d) + "%")
    .style("height", "72px")
    .style("display", "inline-block")
    .style("background-color", (d, i) => d ? colors[i] : "transparent")

    // remove
    div.exit().remove()
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
