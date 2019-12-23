import React from 'react'
import {connect} from 'react-redux'
import {appendAxisYScaleRes, appendAxisData} from '../../actions'
import {ratio} from '../../data/config'
import {numToTxt, appendFormatToNum} from '../../data/typeNumber'
import {getDomainExtend} from '../../data/calcScaleDomain'
import {getAxisYTextWidth} from '../../data/calcAxisYText'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  scales: state.dataChart.scales,
  margin: state.dataChart.margin,
  axisRanges: state.dataChart.ranges,
  axis: state.dataEditable.axis,
  numFormat: state.dataChart.numberFormat,
  unit: state.dataTable.meta.unit
})

const mapDispatchToProps = (dispatch) => ({
  setAxisYScale: (indent, height, margin) => dispatch(appendAxisYScaleRes(indent, height, margin)),
  setAxisYTicks: (type, axisData) => dispatch(appendAxisData(type, axisData))
})


class AxisY extends React.Component {
  updateAxisYScale() {
    const {scales, setAxisYScale, id} = this.props
    if (!scales.y) return

    // for react update
    const indent = getAxisYTextWidth(id)
    setAxisYScale(indent, this.svgHeight, this.svgMarginTop)
  }

  setAxisData() {
    const {id, scales} = this.props
    this.axisY = scales.y.copy().range([100, 0])
    this.ticks = id === "colGroupStack100" ? [100, 75, 50, 25, 0] : this.axisY.ticks(5)

    // extend for lines and plots but cols
    if (id.indexOf("col") === -1) {
      const extend = getDomainExtend(this.axisY.domain(), this.ticks)
      this.axisY.domain(extend.domain)
      this.ticks = extend.ticks
    }

    this.axisData = {range: this.axisY.domain(), ticks: this.ticks}
  }
  resetAxisData() {
    this.axisY.domain(this.props.axis.y.range)
    this.ticks = this.props.axis.y.ticks
  }

  // mounting
  componentDidMount() {
    if (!this.props.axis) {
      this.props.setAxisYTicks("y", this.axisData)
    }
    setTimeout(() => this.updateAxisYScale(), 0)
  }
  // updating
  componentDidUpdate() {
    if (!this.props.axis) {
      this.props.setAxisYTicks("y", this.axisData)
    }
    this.updateAxisYScale()
  }


  render() {
    if (!this.props.scales.y) return null

    /* data */
    const {id, margin, numFormat, unit, axis, axisRanges} = this.props
    if (!axis) {
      this.setAxisData()
    } else {
      this.resetAxisData()
    }
    const domain = this.axisY.domain()
    const height = Math.round(((axisRanges.y[1] - axisRanges.y[0]) / (domain[1] - domain[0]))*10000)/100
    const marginTop = Math.round(((domain[1] - axisRanges.y[1]) / (domain[1] - domain[0]))*10000)*ratio/100

    this.svgHeight = /*extend.*/height ? /*extend.*/height : 100
    this.svgMarginTop = /*extend.*/marginTop ? /*extend.*/marginTop : 0

    // wrap for drawing
    const tickData = this.ticks.map(tick => ({
        val: tick,
        txt: numToTxt(tick),
        pos: Math.round(this.axisY(tick)*100)/100
    }))

    // add unit to last tick text
    const is100 = id.indexOf("100") > -1
    const iLast = tickData.length-1
    const textLast = tickData[iLast].txt
    tickData[iLast].txt = appendFormatToNum(textLast, unit, numFormat, is100, false, false)

    const indexTick0 = this.ticks.indexOf(0)
    const indexTickSolidGrid = indexTick0 > -1 ? indexTick0 : 0

    /* draw */
    const drawAxisText = (text, i) =>
      <span className="axis-y-text" style={{
        display: "inline-block",
        width: false,
      }}>
        <ComponentEditor text={text} type="yTexts" isTop={i===iLast}/>
      </span>

    const drawAxis = tickData.map((tick, i) =>
      <div key={i} className="axis-y-grid" style={{
        position: "absolute",
        top: tick.pos + "%",
        width: "100%",
        borderBottom: "1px #dcdcdc " + (i===indexTickSolidGrid ? "solid" : "dotted"),
        marginTop: "-19px",
        lineHeight: "18px"
      }}>{drawAxisText(tick.txt, i)}</div>
    )

    //console.log(margin);
    return (
      <div className="axis-y" style={{
        position: "absolute",
        top: margin ? margin.top : 0,
        width: "100%",
        height: "calc(100% - " + (margin ? margin.top + margin.bottom : 0) + "px)"
      }}>{drawAxis}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AxisY)
