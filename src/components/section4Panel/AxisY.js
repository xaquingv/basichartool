import React from 'react'
import {connect} from 'react-redux'
import {appendAxisYScale} from '../../actions'
import {numToTxt, appendFormatToNum} from '../../data/typeNumber'
import {getDomainExtend} from '../axis/domain'


const space = 6

const mapStateToProps = (state) => ({
  id: state.chartId,
  scale: state.dataChart.scales,
  numFormat: state.dataChart.numberFormat,
  unit: state.dataTable.meta.unit
})

const mapDispatchToProps = (dispatch) => ({
  setAxisYScale: (indent, height, margin) => dispatch(appendAxisYScale(indent, height, margin))
})


class AxisYScale extends React.Component {
  updateAxisYScale(test) {
    const {scale, setAxisYScale, isPlot} = this.props
    if (!scale.y) return

    const els = [...document.querySelectorAll(".axis-y-grid span")].slice(0, -1)
    const widths = els.map(el => el.offsetWidth)
    const indent = Math.max.apply(null, widths) + space + (isPlot ? 3 : 0)
    setAxisYScale(indent, this.svgHeight, this.svgMarginTop) // for react update
  }

  componentDidMount() {
    // NOTE: to avoid calc bf style applied ?
    setTimeout(() => this.updateAxisYScale(1), 0)
  }
  componentDidUpdate() {
    this.updateAxisYScale(2)
  }

  render() {
    const {id, scale, numFormat, unit} = this.props
    //console.log("y scale")
    if (!scale.y) return null

    /* data */
    let axisY = scale.y.copy().range([100, 0])
    let ticks = id === "colGroupStack100" ? [0, 25, 50, 75, 100] : axisY.ticks(5)

    // extend for lines and plots but cols
    let extend = {}
    if (id.indexOf("col") === -1) {
      extend = getDomainExtend(axisY.domain(), ticks)
      axisY.domain(extend.domain)
      ticks = extend.ticks
    }
    this.svgHeight = extend.height ? extend.height : 100
    this.svgMarginTop = extend.marginTop ? extend.marginTop : 0

    const tickData = ticks.map(tick => ({
        val: tick,
        txt: numToTxt(tick),
        pos: Math.round(axisY(tick)*100)/100
    }))
    // add unit to last tick text
    //tickData[tickData.length-1].txt += unit ? " " + unit : ""
    const is100 = id.indexOf("100") > -1
    const textLast = tickData[tickData.length-1].txt
    tickData[tickData.length-1].txt = appendFormatToNum(textLast, unit, numFormat, is100, false, false)

    const indexTick0 = ticks.indexOf(0)
    const indexTickSolidGrid = indexTick0 > -1 ? indexTick0 : 0


    /* draw */
    const drawAxisText = (text) =>
      <span className="axis-y-text" style={{
        display: "inline-block",
        width: false,
      }}>{text}</span>

    const drawAxis = tickData.map((tick, i) =>
      <div key={i} className="axis-y-grid" style={{
        position: "absolute",
        top: tick.pos + "%",
        width: "100%",
        borderBottom: "1px #dcdcdc " + (i===indexTickSolidGrid ? "solid" : "dotted"),
        marginTop: "-19px",
        lineHeight: "18px"
      }}>{drawAxisText(tick.txt)}</div>
    )

    return (
      <div className="axis-y" style={{
        position: "absolute",
        width: "100%",
        height: "100%"
      }}>{drawAxis}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisYScale)
