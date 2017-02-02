import React from 'react'
import {connect} from 'react-redux'
//import {numToTxt} from '../../lib/format'

const mapStateToProps = (state) => ({
  id: state.chartId,
  scales: state.dataChart.scales,
  indent: state.dataChart.indent
})

const mapDispatchToProps = (dispatch) => ({
})


class AxisX extends React.Component {

  render() {
    const {/*id,*/ scales, indent} = this.props
    //console.log("id:", id)

    if (!scales.x) return null

    /* data */
    const axisX = scales.x.copy().range([0, 100])
    const domain = axisX.domain()
    axisX.domain([+domain[0], +domain[1]])
    //console.log("range_axisX:", axisX.range())
    //console.log("range_scale:", scales.x.range())
    /*console.log("x indent:", indent)
    console.log(axisX.domain())
    console.log(axisX.ticks(5))*/

    const ticks = axisX.ticks(5).map(tick => ({
        txt: tick,
        pos: Math.round(axisX(tick)*100)/100
    }))
    //console.log(ticks)

    /* draw */
    const drawAxisTicks = ticks.map((tick, i) =>
      <div key={"tick" + i} className="axis-x-tick" style={{
        position: "absolute",
        left: tick.pos + "%",
        width: "1px",
        height: "6px",
        //backgroundColor: "red"
      }}></div>
    )

    //const len_1 = ticks.length - 1
    const width = ticks[1].pos - ticks[0].pos
    const shift = width / 2
    const getAdjustWidth = (i) => {
      switch(i) {
        //case 0:
          //return "calc(" + shift + "% + " + indent + "px)"
        //case len_1:
          //return shift + "%"
        default:
          return width + "%"
      }
    }
    const drawAxisTexts = ticks.map((tick, i) =>
      <div key={"text" + i}  className="axis-x-text" style={{
        position: "absolute",
        left: /*i===0 ? (-indent)+"px" :*/ (tick.pos-shift)+"%",
        width: getAdjustWidth(i), // TODO: max-width and recalc left?
        lineHeight: "18px",
        textAlign: "center"
      }}>{tick.txt}</div>
    )

    return (
      <div className="axis-x" style={{
        position: "absolute",
        top: "calc(100% - 1px)", // due to svg padding: 1px
        right: "2px",
        width: "calc(100% - " + indent + "px)",
      }}>{drawAxisTicks}{drawAxisTexts}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisX)
