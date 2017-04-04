import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {appendAxisData} from '../../actions'
import {appendFormatToNum} from '../../data/typeNumber'
import {getTickSteps, getTickTexts, getTickTextWidths, getTickDataEditable} from '../../data/calcAxisXTick'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  dataChart: state.dataChart,
  chartSize: state.dataSetup.size,
  unit: state.dataTable.meta.unit,
  axis: state.dataEditable.axis
})

const mapDispatchToProps = (dispatch) => ({
    initAxisXTicks: (type, axisData) => dispatch(appendAxisData(type, axisData))
})


class AxisX extends React.Component {
  setAxisData() {
    const {id, dataChart, isBarBased} = this.props
    const {scales, dateCol, string1Col, dateString, dateFormat, dateHasDay, rowCount, numberCols} = dataChart

    // TODO: dataX should come with scales, assign in charts
    this.dataX = dateCol || (string1Col.length !== 0 ? string1Col : numberCols[0])
    this.axisX = scales.x.copy()
    .domain(["bar100", "barGroupStack100", "brokenBar"].includes(id) ? [0, 100] : scales.x.domain()) // ui range @setup2
    .range([0, 100]) // d3 range

    this.ticks = getTickSteps(id, isBarBased, this.dataX, dateFormat, rowCount, this.axisX)
    this.texts = getTickTexts(id, isBarBased, this.dataX, dateFormat, dateHasDay, this.axisX.domain(), this.ticks)

    const isDate = this.ticks[0].toString() !== this.texts[0].replace(",", "")
    const range = this.axisX.domain()
    const edits = isDate ? getTickDataEditable(id, this.ticks, this.texts, dateString || string1Col, range, dateFormat) : undefined
    this.axisData = {range, ticks: this.ticks, texts: this.texts, edits}
  }

  resetAxisData() {
    const {id, dataChart, isBarBased} = this.props
    const {dateFormat, dateHasDay} = dataChart

    this.axisX.domain(this.props.axis.x.range)
    this.ticks = this.props.axis.x.ticks
    this.texts = getTickTexts(id, isBarBased, this.dataX, dateFormat, dateHasDay, this.axisX.domain(), this.ticks)
  }

  // mounting
  componentDidMount() {
    this.renderGrid()
    if (!this.props.axis) {
      this.props.initAxisXTicks("x", this.axisData)
    }
  }

  // updating
  componentDidUpdate() {
    this.renderGrid()
    if (!this.props.axis) {
      this.props.initAxisXTicks("x", this.axisData)
    }
  }


  render() {
    if (!this.props.dataChart.scales.x) return null

    /* data */
    const {id, dataChart, chartSize, isBarBased, isOnBar, isPlot, unit, axis} = this.props
    const {indent, string1Width} = dataChart

    if (!axis) {
      this.setAxisData()
    } else {
      this.resetAxisData()
    }
    const is100 = id.indexOf("100") > -1
    this.texts[0] = appendFormatToNum(this.texts[0], unit, dataChart.numberFormat, is100, isBarBased, true) // true - isX

    // wrap for drawing
    const tickData = getTickTextWidths(this.texts).map((width, i) => ({
      pos: Math.round(this.axisX(this.ticks[i])*100)/100,
      txt: this.texts[i],
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
      <div key={"text" + i}
        className={"axis-x-text" + (isBarBased ? " axis-top-text" : "")}
        style={{
        position: "absolute",
        top: "8px",
        left: "calc(" + (tick.pos - tick.txtWidth/2) + "% + " + (isPlot ? -2 : 0) + "px)",
        width: tick.txtWidth + "%",
        lineHeight: "14px",
        paddingTop: "2px",
        textAlign: "center"
      }}>
        <ComponentEditor text={tick.txt} type="xTexts" />
      </div>
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
      }}>
        {drawAxisTicks}
        {drawAxisTexts}
      </div>
    )
  }

  renderGrid() {
    const {isBarBased, dataChart} = this.props
    if (!isBarBased || this.grid.length === 0) return

    let margin = dataChart.margin
    margin = margin ? margin : {left: 0, right: 0}
    //console.log(margin)

    d3.selectAll("#section4 .grid")
    .html("")
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
