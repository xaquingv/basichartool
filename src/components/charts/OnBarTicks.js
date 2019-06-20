import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendChartData} from '../../actions'
import {addBarsBackground} from './onBar'
import ComponentRow from './BarBase'


const barHeight = 16
const tickWidth = 6
const tickBorderRadius = 2
const margin = tickWidth / 2

const mapStateToProps = (state, props) => ({
  data: { ...state.dataChart, ...props.dataChart },
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (data, keys, scale, margins) => dispatch(appendChartData(data, keys, scale, margins))
})


class TickOnBar extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const {data, onSelect, callByStep} = this.props

    // step 2: Discover
    const setChartData = () => {
      if (callByStep === 2) { onSelect(data, data.keys, this.scale, {left: margin, right: margin}) }
    }

    // step 3: Edit
    const isLabel = callByStep === 3
    return (
      <div className="canvas" ref="div" onClick={setChartData}>
        {data.rowGroup.map((label, i) =>
        <ComponentRow isLabel={isLabel} label={label} key={i}/>
        )}
      </div>
    )
  }

  renderChart() {

    /* data */
    const {data, colors, axis, callByStep} = this.props
    const domain = callByStep === 3 && axis ? axis.x.range : d3.extent(data.numbers)
    // using axis.x.range due to editable range @setup2, section 4

    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
    .domain(domain)
    .range([0, 100])

    // chart
    this.dataChart = data.numberRows.map((numbers, i) => {
      const count = {}
      numbers.forEach(num => count[num] = (count[num] || 0) + 1)
      //             (num => count[num] = count[num] ? count[num] + 1 : 1)
      return numbers.map((num, i) => ({
        value: num,
        index: numbers.slice(0, i+1).filter(n => n === num).length,
        count: count[num],
        color: colors[i]
      }))
      // sort to help with overlapped layout
      .sort((num1, num2) => num1.value - num2.value)
      .sort((num1, num2) => num1.count - num2.count)
    })


    /* draw */
    this.drawChart({scaleX: this.scale.x})
  }

  drawChart(opt) {

    let gs = addBarsBackground(this.refs.div, this.dataChart, margin)

    // ticks
    gs.append("div")
    .attr("title", d => d.value)
    .style("background-color", d => d.color)
    //.style("opacity", 0.85)
    .style("width", tickWidth + "px")
    .style("height", d => (barHeight/d.count) + "px")
    .style("position", "absolute")
    .style("top", d => (barHeight * (d.index-1) / d.count) + "px")
    .style("left", d => "calc(" + opt.scaleX(d.value) + "% - " + margin + "px)")
    //.style("border-radius", tickBorderRadius + "px")
    .style("border-top-right-radius",    d => d.index === 1       ? tickBorderRadius + "px" : false)
    .style("border-top-left-radius",     d => d.index === 1       ? tickBorderRadius + "px" : false)
    .style("border-bottom-right-radius", d => d.index === d.count ? tickBorderRadius + "px" : false)
    .style("border-bottom-left-radius",  d => d.index === d.count ? tickBorderRadius + "px" : false)
    // hide null data
    .style("opacity", d => d.value === null ? 0 : false)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TickOnBar)
