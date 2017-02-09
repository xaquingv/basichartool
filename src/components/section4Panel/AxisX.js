import React from 'react'
import {connect} from 'react-redux'
import {getTickSteps, getTickTexts, getTickTextWidths} from '../axis/tickX'


const mapStateToProps = (state) => ({
  id: state.chartId,
  dataChart: state.dataChart,
})

const mapDispatchToProps = (dispatch) => ({
})


class AxisX extends React.Component {

  render() {
    const {id, dataChart} = this.props
    const {scales, indent, dateCol, string1Col, dateHasDay, dateFormat, rowCount} = dataChart

    if (!scales.x) return null

    /* data */
    const isBarBased = id.toLowerCase().indexOf("bar") > -1
    const isPlot = id.toLowerCase().indexOf("plot") > -1

    const dates = dateCol || string1Col
    const axisX = scales.x.copy().range([0, 100])
    const ticks = getTickSteps(id, isBarBased, dates, dateFormat, rowCount, axisX)
    const texts = getTickTexts(id, isBarBased, dates, dateFormat, dateHasDay, axisX.domain(), ticks)

    const tickData = getTickTextWidths(texts).map((width, i) => ({
      pos: Math.round(axisX(ticks[i])*100)/100,
      txt: texts[i],
      txtWidth: width
    }))


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

    return (
      <div className="axis-x" data-y-indent={isBarBased ? 0:indent} data-x-bottom={!isBarBased} style={{
        position: "absolute",
        top: isBarBased ? "-30px" : "calc(100% - 1px)", // due to svg padding: 1px
        // TODO: onBar axis-x margin left/right
        right: "1px",
        width: "calc(100% - " + (isBarBased ? 1 : indent) + "px)",
      }}>{drawAxisTicks}{drawAxisTexts}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisX)
