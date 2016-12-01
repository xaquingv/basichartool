import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {swapArray} from '../../lib/array'
import {colors, colorBarBackground} from '../../data/config'

/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const barHeight = 16
const marginBottom = 8
const bodyHeight = 4
const bodyTop = (barHeight - bodyHeight) / 2

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
    const dataCols = this.props.dataChart.cols
    // const dataDates
    const dataNumbers = swapArray(dataCols
    .filter(d => d.type === "number")
    .map(numberCol => numberCol.values))

    //console.log(dataNumbers)
    const domain = d3.extent([].concat.apply([], dataNumbers))
    //console.log(domain)
    const scaleX = d3.scaleLinear()
    .domain(domain)
    .range([0, 100])

    const dataChart = dataNumbers.map((ns, i) => ({
      value: ns,
      width: Math.abs(scaleX(ns[1]) - scaleX(ns[0])),
      shift: scaleX(Math.min(ns[0], ns[1]))//,
    }))
    //console.log(dataChart)

    const dotColors = colors.slice(0, 2)


    /* draw */
    const els = this.refs

    let gs, g
    gs = d3.select(els.div)
    // TODO: remove temp solution
    .html("")
    .selectAll(".group")
    .data(dataChart/*Arrow*/)

    g = gs.enter().append("div")
    .attr("class", "group")
    .attr("title", d => d.value)
    .style("height", barHeight + "px")
    .style("margin-bottom", marginBottom + "px")
    .style("position", "relative")
    .style("background-color", colorBarBackground)
    .selectAll("div")
    .data(d => [d])
    .enter()

    // bar
    g.append("div")
    .attr("class", "bar")
    .style("width", d => d.width + "%")
    .style("height", bodyHeight + "px")
    .style("position", "absolute")
    .style("top", bodyTop + "px")
    .style("left", d => d.shift + "%")
    .style("background-color", d => "#dfdfdf")
    // dots
    g.selectAll(".dots")
    .data(d => d.value)
    .enter().append("div")
    .attr("class", "dots")
    .style("width", "10px")
    .style("height", "10px")
    .style("border-radius", "5px")
    .style("background-color", (d, i) => dotColors[i])
    .style("position", "absolute")
    .style("top", "3px")
    .style("left", (d, i) => i === 0 ? scaleX(d) + "%" : "calc(" + scaleX(d) + "% - 10px)")
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
