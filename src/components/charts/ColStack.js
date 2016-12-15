import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {getDomainByDataRange} from './domain'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class ColStack extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return (
      <svg ref="svg"></svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const labelGroup = data.string1Col.length > 0 ? data.string1Col : data.dateCol
    const numberRows = data.numberRows
    const numberRowSums = numberRows.map(ns => ns.reduce((n1, n2) => n1 + n2))

    const dataChart = labelGroup.map((date, i) => ({
      group: date,
      ...numberRows[i]
    }))
    const stack = d3.stack().keys(Object.keys(numberRows[0]))

    const width = this.props.width
    const height = width*0.6

    const scaleX = d3.scaleBand()
    .domain(labelGroup)
    .rangeRound([0, width])
    .paddingInner(0.1)

    const domain = getDomainByDataRange(numberRowSums)
    const scaleY = d3.scaleLinear()
    .domain(domain)
    .rangeRound([height, 0])

    /* draw */
    // init gs
    let gs =
    d3.select(this.refs.svg)
    .selectAll("g")
    .data(stack(dataChart))

    // update
    gs
    // TODO: double check
    .html("")
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX(labelGroup[i]))
    .attr("y", d => domain[1] > 0 ? scaleY(d[1]) : scaleY(d[0]))
    .attr("width", scaleX.bandwidth())
    .attr("height", d => Math.abs(scaleY(d[0]) - scaleY(d[1])))
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // new
    gs.enter().append("g")
    .attr("class", "group")
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX(labelGroup[i]))
    .attr("y", d => domain[1] > 0 ? scaleY(d[1]) : scaleY(d[0]))
    .attr("width", scaleX.bandwidth())
    .attr("height", d => Math.abs(scaleY(d[0]) - scaleY(d[1])))
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // remove
    gs.exit().remove()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColStack)
