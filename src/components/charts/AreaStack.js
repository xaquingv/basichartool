import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'
import {setupLegend} from '../../actions'

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys) => dispatch(setupLegend(keys))
})


class Area extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {callByStep, dataChart, onSelect} = this.props

    const setLegendData = () => {
      if (callByStep === 3) { onSelect(dataChart.keys) }
    }

    return (
      <svg ref="svg" onClick={setLegendData}>
        <line ref="line" x1="0" x2="100%" y1="50%" y2="50%"></line>
      </svg>
    )
  }

  renderChart() {

    /* data */
    const data = this.props.dataChart
    const dates = data.dateCol
    const numberCols = data.numberCols

    let isNot100 = []
    let maxSum = 0
    const dataChart = dates.map((date, i) => {
      const nums = numberCols.map(numbers => numbers[i])

      // TODO: remove temp validation
      const sum = nums.reduce((n1, n2) => n1+n2)
      if (sum < 99 || sum > 101) { isNot100.push(true) }
      if (sum > maxSum) maxSum = sum
      //console.log(sum)

      // TODO: rescale to 100% !?

      return {date, ...nums}
    })


    let keys = Object.keys(dataChart[0])
    keys.splice(keys.indexOf("date"), 1)

    const stack = d3.stack().keys(keys)
    // TODO: stack data not 100%? extend to 100%
    //const dataChartStack = stack(dataChart)
    //console.log(dataChart)
    //console.log(dataChartStack)
    //console.log(stack(dataChart))


    /* draw */
    const width = this.props.width
    const height = width*0.6

    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear
    const scaleX = scaleTime()
    .domain(d3.extent(dates))
    .range([0, width])

    //console.log(maxSum)
    const domainMax = isNot100.length > 0 ? maxSum : 100
    const scaleY = d3.scaleLinear()
    .domain([0, domainMax])
    .range([height, 0])

    const area = d3.area()
    //.defined(d => {console.log(d); return d})
    // TODO: use curveStepBefore and add 10px for the last step
    //.curve(d3.curveStep/*Before*/)
    .x((d, i) => scaleX(d.data.date))
    .y0((d) => scaleY(d[0]))
    .y1((d) => scaleY(d[1]))

    let els = this.refs
    if (isNot100.length === 0) {
      area.curve(d3.curveStep/*Before*/)
    } else {
      d3.select(els.line)
      .classed("d-n", true)
    }

    // init area
    let svg = d3.select(els.svg)
    //.classed("d-n", false)
    .selectAll("path")
    .data(stack(dataChart))

    // update
    svg
    .attr("d", d => area(d))
    .attr("fill", (d, i) => colors[i])

    // new
    svg.enter().insert("path", ":first-child")
    .attr("d", d => area(d))
    .attr("fill", (d, i) => colors[i])
    .attr("fill-opacity", .75)
    .attr("shape-rendering", "auto")

    // remove
    svg.exit().remove()

    // 50% line
    d3.select(els.line)
    .attr("fill-opacity", 1)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3, 3")
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Area)
