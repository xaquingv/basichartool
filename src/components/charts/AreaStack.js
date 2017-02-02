import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {updateChartData} from '../../actions'

const mapStateToProps = (state) => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(updateChartData(keys, scale))
})


class Area extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props
    const setChartData = () => {
      if (callByStep === 3) { onSelect(data.keys, this.scale) }
    }

    return (
      <svg ref="svg" onClick={setChartData}>
        <line ref="line" x1="0" x2="100%" y1="50%" y2="50%"></line>
      </svg>
    )
  }

  renderChart() {

    /* data */
    const {data, width, colors} = this.props
    const dates = data.dateCol
    const numberCols = data.numberCols

    // chart part 1/2
    let maxSum = 0
    let isNot100 = []
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

    // scale
    const height = width*0.6
    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear
    const domainMax = isNot100.length > 0 ? maxSum : 100

    this.scale = {}
    this.scale.x = scaleTime()
    .domain(d3.extent(dates))
    .range([0, width])

    this.scale.y = d3.scaleLinear()
    .domain([0, domainMax])
    .range([height, 0])

    // chart part 2/2
    const area = d3.area()
    //.defined(d => {console.log(d); return d})
    // TODO: use curveStepBefore and add 10px for the last step
    //.curve(d3.curveStep/*Before*/)
    .x((d, i) => this.scale.x(d.data.date))
    .y0((d) => this.scale.y(d[0]))
    .y1((d) => this.scale.y(d[1]))

    let els = this.refs
    if (isNot100.length === 0) {
      area.curve(d3.curveStep/*Before*/)
    } else {
      d3.select(els.line)
      .classed("d-n", true)
    }


    /* draw */
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
