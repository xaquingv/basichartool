import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {numToTxt} from '../../lib/format'
import {getDateTextFormat, dateNumToTxt} from '../../data/typeDate'

const mapStateToProps = (state) => ({
  id: state.chartId,
  scales: state.dataChart.scales,
  indent: state.dataChart.indent,
  hasDay: state.dataChart.dateHasDay,
  format: state.dataChart.dateFormat,
  rowLen: state.dataChart.rowCount,
  dates: state.dataChart.dateCol
})

const mapDispatchToProps = (dispatch) => ({
})


class AxisX extends React.Component {

  render() {
    const {id, scales, indent} = this.props

    if (!scales.x) return null
    console.log("id:", id, "x indext", indent)

    /* data */
    const isBarBased = id.toLowerCase().indexOf("bar") > -1 ? true : false

    const axisX = scales.x.copy().range([0, 100])
    const ticks = this.getTickSteps(isBarBased, axisX)
    const texts = this.getTickTexts(isBarBased, ticks, axisX.domain())
    //console.log(ticks)

    const tickData = ticks.map((tick, i) => ({
      txt: texts[i],
      pos: Math.round(axisX(tick)*100)/100
    }))


    /* draw */
    const drawAxisTicks = tickData.map((tick, i) =>
      <div key={"tick" + i} className="axis-x-tick" style={{
        position: "absolute",
        top: isBarBased ? "24px" : "1px",
        left: tick.pos + "%",
        width: "1px",
        height: "5px",
      }}></div>
    )

    //const len_1 = ticks.length - 1
    const width = tickData[1].pos - tickData[0].pos
    const shift = width / 2
    /*const getAdjustWidth = (i) => {
      switch(i) {
        case 0:
          return "calc(" + (shift+ticks[0].pos) + "% + " + indent + "px)"
        case len_1:
          return shift + (100-ticks[len_1].pos) + "%"
        default:
          return width + "%"
      }
    }*/
    const drawAxisTexts = tickData.map((tick, i) =>
      <div key={"text" + i}  className="axis-x-text" style={{
        position: "absolute",
        left: /*i===0 ? (-indent)+"px" :*/ (tick.pos-shift)+"%",
        width: width + "%",//getAdjustWidth(i), // TODO: max-width and recalc left?
        lineHeight: "18px",
        textAlign: "center"
      }}><span>{tick.txt}</span></div>
    )

    return (
      <div className="axis-x" style={{
        position: "absolute",
        top: isBarBased ? "-30px" : "calc(100% - 1px)", // due to svg padding: 1px
        // TODO: onBar axis-x margin left/right
        right: "2px",
        width: "calc(100% - " + (isBarBased ? 3 : indent) + "px)",
      }}>{drawAxisTicks}{drawAxisTexts}</div>
    )
  }

  getTickSteps(isBarBased, axisX) {
    const {id, dates, rowLen} = this.props

    switch (true) {
      case ["brokenBar"].includes(id):
        axisX.domain([0, 100]) // override domain
        return [50]

      case ["bar100", "barGroupStack100"].includes(id):
        axisX.domain([0, 100]) // override domain
        return [0, 25, 50, 75, 100]

      // TODO: add 0 to id.indexOf("bar") ?

      case (isBarBased || rowLen > 7):
        return axisX.ticks(5)

      default:
        return dates
    }
  }

  getTickTexts(isBarBased, ticks, domain) {
    const {id, dates, hasDay, format} = this.props

    let texts, year // to remove repeat years
    switch (true) {
      // bar based
      case isBarBased || id==="plotScatter":
        texts = ticks.map(tick => numToTxt(tick))
        break

      // not bar based
      case hasDay:
        const dateObjToTxt = id==="lineDiscrete" ? d3.timeFormat("%d/%m %Y") : d3.timeFormat(getDateTextFormat(domain))
        texts = ticks.map((tick) => {
          const val = id==="lineDiscrete" ? dates[tick] : tick
          const tic = dateObjToTxt(val).replace(year, "").trim()
          console.log(tick, val, tic)
          year = val.getFullYear()
          return tic
        })
        break

      case !isBarBased:
        texts = ticks.map(tick => {
          const val = id==="lineDiscrete" ? dates[tick] : tick
          const txt = dateNumToTxt(val, format, hasDay)
          const tic = txt.replace(year, "").trim()
          year = txt.match(/[0-9]{4}/g)
          return tic
        })
        break

      default:
        console.errror("axis-x need another condition?")
    }

    return texts
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisX)
