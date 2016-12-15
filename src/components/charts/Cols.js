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


class Col extends React.Component {

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

    const dataChart = labelGroup.map((label, i) => ({
      group: label,
      value: numberRows[i]
    }))

    const width = this.props.width
    const height = width*0.6

    const scaleX0 = d3.scaleBand()
    .domain(labelGroup.map((d, i) => i))
    .rangeRound([0, width])

    const scaleX1 = d3.scaleBand()
    // TODO: remove temp, use lables instead
    .domain(numberRows[0].map((d, i) => i))
    .rangeRound([0, scaleX0.bandwidth()])
    .paddingOuter([0.1])

    const scaleY = d3.scaleLinear()
    .domain(getDomainByDataRange(data.numbers))
    .rangeRound([height, 0])


    /* draw */
    // init gs
    let gs =
    d3.select(this.refs.svg)
    .selectAll("g")
    .data(dataChart)

    // update
    gs
    // TODO: double check
    .html("")
    .attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
    .selectAll("rect")
    .data(d => d.value)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX1(i))
    .attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
    .attr("width", scaleX1.bandwidth())
    .attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // new
    gs.enter().append("g")
    .attr("class", "group")
    .attr("transform", (d, i) => "translate(" + scaleX0(i) + ",0)")
    .selectAll("rect")
    .data(d => d.value)
    .enter().append("rect")
    .attr("x", (d, i) => scaleX1(i))
    .attr("y", d => d > 0 ? scaleY(d) : scaleY(0))
    .attr("width", scaleX1.bandwidth())
    .attr("height", d => Math.abs(scaleY(d) - scaleY(0)))
    .attr("fill", (d, i) => d ? colors[i] : "transparent")
    //.attr("title", d => "(" + d.date + ", " + d.number + ")")

    // remove
    gs.exit().remove()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Col)
