import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors, colorBarBackground} from '../../data/config'
import {drawBarsBackground} from './barOnBar'
/*
  data spec
  missing data accepted
  cols [4, many]
  - date: no-repeat
  - number*: any range, min 3
*/

const barHeight = 16
const barMarginBottom = 8
const tickWidth = 6
const tickShift = tickWidth / 2
const tickBorderRadius = 2

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate() {

    /* data */
    const data = this.props.dataChart

    const dataChart = data.numberRows.map((numbers, i) => {
      const count = {}
      numbers.forEach(num => count[num] = (count[num] || 0) + 1)
      //             (num => count[num] = count[num] ? count[num] + 1 : 1)
      return numbers.map((num, i) => ({
        value: num,
        index: numbers.slice(0, i+1).filter(n => n === num).length,
        count: count[num]
      }))
    })
    //console.log(dataChart)

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([0, 100])


    /* draw */
    const id = this.props.id
    const els = this.refs
    drawBarsBackground(els, dataChart, tickShift)
    drawChart(els, dataChart, {id, scaleX})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)


function drawChart(els, dataChart, opt) {
  /*console.log(opt.id)

  let div = d3.select(els.div)
  let gs1 = div.selectAll(".group")
  let gs2 = document.querySelectorAll("#"+opt.id + " .group")
  //.selectAll(".group")
  //.selectAll("div.group")
  console.log(div)
  console.log(gs1)
  console.log(gs2)*/

  let gs = d3.select(els.div)
  .html("")
  .selectAll(".group")
  .data(dataChart)
  .enter().append("div")
  .style("height", barHeight + "px")
  .style("margin-bottom", barMarginBottom + "px")
  .style("background-color", colorBarBackground)
  // shift half tick size
  .append("div")
  .attr("class", "group")
  .style("position", "relative")
  .style("margin", "0 " + tickShift + "px")
  .selectAll("div")
  .data(d => d)
  .enter()

  // ticks
  gs.append("div")
  .attr("title", d => d.value)
  .style("background-color", (d, i) => colors[i])
  .style("width", tickWidth + "px")
  .style("height", d => (barHeight/d.count) + "px")
  .style("position", "absolute")
  .style("top", d => (barHeight * (d.index-1) / d.count) + "px")
  .style("left", d => "calc(" + opt.scaleX(d.value) + "% - " + tickShift + "px)")
  //.style("border-radius", tickBorderRadius + "px")
  .style("border-top-right-radius",    d => d.index === 1       ? tickBorderRadius + "px" : false)
  .style("border-top-left-radius",     d => d.index === 1       ? tickBorderRadius + "px" : false)
  .style("border-bottom-right-radius", d => d.index === d.count ? tickBorderRadius + "px" : false)
  .style("border-bottom-left-radius",  d => d.index === d.count ? tickBorderRadius + "px" : false)
}
