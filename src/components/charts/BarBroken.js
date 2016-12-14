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

const barHeight = 72

const mapStateToProps = (state) => ({
  stepUser: state.step,
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {
  /* update controls */
  componentDidMount() {
    if (this.props.isUpdate) this.setState({kickUpdate: true})
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isSelected && nextProps.stepUser === nextProps.stepCall
  }

  componentDidUpdate(){
    // TODO: add multi broken bars as another chart

    /* data */
    const data = this.props.dataChart
    const numbers = data.numbers

    const scaleX = d3.scaleLinear()
    .domain([0, numbers.reduce((n1, n2) => n1 + n2)])
    .range([0, 100])

    const dataChart = numbers.map(number => ({
      title: number,
      width: scaleX(number)
    }))


    /* draw */
    const els = this.refs
    drawChart(els, dataChart)
    drawAxis(els)
  }


  render() {
    return (
      <div className="chart" ref="div">
        <div ref="bars"></div>
        <div ref="axis">
          <div ref="axis_tick"></div>
          <div ref="axis_mark">50%</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)


function drawChart(els, dataChart) {
  d3.select(els.bars)
  .html("")
  .style("padding-top", 48 + "px") // override
  .style("height", barHeight + "px")
  .selectAll("div")
  .data(dataChart)
  .enter().append("div")
  .attr("title", d => d.title)
  .style("width", d => d.width + "%")
  .style("height", barHeight + "px")
  .style("display", "inline-block")
  .style("background-color", (d, i) => d ? colors[i] : "transparent")
}

function drawAxis(els) {
  d3.select(els.axis)
  .style("position", "relative")

  d3.select(els.axis_tick)
  .style("position", "absolute")
  .style("left", "50%")
  .style("height", "8px")
  .style("border-left", "1px solid #bdbdbd") //grey-3

  d3.select(els.axis_mark)
  .style("position", "absolute")
  .style("top", "10px")
  .style("width", "100%")
  .style("text-align", "center")
  .style("font-size", "12px")
  .style("color", "#bdbdbd")
}
