import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendFormatToNum} from '../../data/typeNumber'
import {getTickSteps, getTickTexts, getTickTextWidths} from '../axis/tickX'


const mapStateToProps = (state) => ({
  id: state.chartId,
  dataChart: state.dataChart,
  chartSize: state.dataSetup.size,
  chartColors: state.dataSetup.colors,
  unit: state.dataTable.meta.unit
})

const mapDispatchToProps = (dispatch) => ({
})


class AxisX extends React.Component {
  componentDidMount() {
    this.renderGrid()
  }
  componentDidUpdate() {
    this.renderGrid()
  }

  render() {
    const {id, dataChart, chartSize/*, chartColors, */,isBarBased, isOnBar, isPlot, unit} = this.props
    const {scales, indent, dateCol, string1Col, string1Width, dateHasDay, dateFormat, rowCount} = dataChart

    if (!scales.x) return null
    //console.log(chartColors)

    /* data */
    const dataX = dateCol || string1Col
    const axisX = scales.x.copy().range([0, 100])
    const ticks = getTickSteps(id, isBarBased, dataX, dateFormat, rowCount, axisX)
    const texts = getTickTexts(id, isBarBased, dataX, dateFormat, dateHasDay, axisX.domain(), ticks)
    const is100 = id.indexOf("100") > -1
    texts[0] = appendFormatToNum(texts[0], unit, dataChart.numberFormat, is100, isBarBased, true) // true - isX

    const tickData = getTickTextWidths(texts).map((width, i) => ({
      pos: Math.round(axisX(ticks[i])*100)/100,
      txt: texts[i],
      txtWidth: width
    }))
    this.grid = tickData.map(d => d.pos)

    const chartWidth = chartSize.w || 300
    const marginLeft = string1Width > chartWidth/3 ? 1 : string1Width+1

    /* draw */
    const drawAxisTicks = tickData.map((tick, i) =>
      <div key={"tick" + i} className="axis-x-tick" style={{
        position: "absolute",
        top: isBarBased ? "24px" : "1px",
        left: "calc(" + tick.pos + "% + " + (isPlot ? -2 : 0) + "px)",
        width: "1px",
        height: "5px",
        backgroundColor: "#dcdcdc"
      }}></div>
    )

    const drawAxisTexts = tickData.map((tick, i) =>
      <div key={"text" + i}  className="axis-x-text" style={{
        position: "absolute",
        top: "8px",
        left: "calc(" + (tick.pos - tick.txtWidth/2) + "% + " + (isPlot ? -2 : 0) + "px)",
        width: tick.txtWidth + "%",
        lineHeight: "14px",
        paddingTop: "2px",
        textAlign: "center"
      }}><span>{tick.txt}</span></div>
    )

    let margin = dataChart.margin
    margin = margin ? margin : {left: 0, right: 0}
    return (
      <div className="axis-x"
        data-x-bottom={!isBarBased}
        data-y-indent={isBarBased ? 0 : indent}
        data-l-indent={margin.left}
        data-r-indent={margin.right}
      style={{
        position: "absolute",
        top: isBarBased ? "-30px" : "calc(100% - 1px)", // due to svg padding: 1px
        right: "1px",
        // NOTE: onBar axis-x margin left/right
        width: "calc(100% - " + ((isBarBased ? marginLeft : indent) + (isOnBar ? margin.left+margin.right : 0)) + "px)",
        marginRight: isOnBar ? margin.right + "px" : 0
      }}>{drawAxisTicks}{drawAxisTexts}</div>
    )
  }

  renderGrid() {
    //console.log("renderGrid() enter")
    const {isBarBased, dataChart} = this.props
    if (!isBarBased || this.grid.length === 0) return
    //console.log("renderGrid() render ...")

    let margin = dataChart.margin
    margin = margin ? margin : {left: 0, right: 0}
    //console.log(margin)

    d3.selectAll("#section4 .grid")
    .style("position", "relative")
    .style("margin-left", margin.left + "px")
    .style("margin-right", (margin.right + 1) + "px")
    .selectAll("div")
    .data(this.grid)
    .enter().append("div")
    .style("position", "absolute")
    .style("left", d => d + "%")
    .style("top", 0)
    .style("width", "1px")
    .style("height", "20px")
    .style("background-color", d =>
      (d===0 && margin.left===0) || (d===100 && margin.right === 0) ?
      "transparent" :
      "rgba(255, 255, 255, 0.8)"
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisX)
