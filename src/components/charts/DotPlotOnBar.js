import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {addBarsBackground, drawBarSticks} from './barOnBar'

/*
data spec
missing data accepted
cols [4, many]
- date: no-repeat
- number*: any range, min 3
*/

const barHeight = 16
const dotSzie = 10
const dotTop = (barHeight - dotSzie) / 2

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const data = this.props.dataChart

    const scaleX = d3.scaleLinear()
    .domain(d3.extent(data.numbers))
    .range([0, 100])

    const dataChart = data.numberRows.map((nums, i) => ([{
      width: Math.abs(scaleX(nums[1]) - scaleX(nums[0])),
      shift: scaleX(Math.min(nums[0], nums[1])),
      dots: nums.map((n, i) => {
        const isOverlapped = nums[0] === nums[1]
        return {
          title: n,
          topCalc: (isOverlapped ? i*dotTop*2 : dotTop) + "px", // 0, 3 (default), 6
          leftCalc: "calc(" + scaleX(n) + "% - " + (dotSzie/2) + "px)"
        }
      })
    }]))
    //console.log(dataChart)


    /* draw */
    drawChart(this.refs, dataChart)
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)


function drawChart(els, dataChart) {

  let gs = addBarsBackground(els.div, dataChart, dotSzie/2)

  // line that connects dots
  drawBarSticks(gs)

  // dots
  gs.selectAll(".dot")
  .data(d => d.dots)
  .enter().append("div")
  .attr("class", "dots")
  .attr("title", d => d.title)
  .style("background-color", (d, i) => colors[i])
  .style("width", dotSzie + "px")
  .style("height", dotSzie + "px")
  .style("position", "absolute")
  .style("top", d => d.topCalc)
  .style("left", d => d.leftCalc)
  .style("border-radius", (dotSzie/2) + "px")
}
