import React from 'react'
import {connect} from 'react-redux'
import {appendAxisYScale} from '../../actions'
import {numToTxt} from '../../lib/format'
import {getDomainExtend} from '../axis/domain'


const space = 5

const mapStateToProps = (state) => ({
  id: state.chartId,
  scale: state.dataChart.scales
})

const mapDispatchToProps = (dispatch) => ({
  setAxisYScale: (indent, height) => dispatch(appendAxisYScale(indent, height))
})


class AxisY extends React.Component {
  updateAxisYScale() {
    const {scale, setAxisYScale} = this.props
    if (!scale.y) return

    const els = [...document.querySelectorAll(".axis-y span")]
    const widths = els.map(el => el.offsetWidth)
    const indent = Math.max.apply(null, widths) + space
    setAxisYScale(indent, this.svgHeight)
  }

  componentDidMount() {
    this.updateAxisYScale()
  }
  componentDidUpdate() {
    this.updateAxisYScale()
  }

  render() {
    const {id, scale} = this.props
    if (!scale.y) return null

    /* data */
    let axisY = scale.y.copy().range([100, 0])
    let ticks = axisY.ticks(5)
    //console.log("org:", axisY.domain(), ticks)

    // extend for lines and plots but cols
    let extend = {}
    if (id.indexOf("col") === -1) {
      extend = getDomainExtend(axisY.domain(), ticks)
      axisY.domain(extend.domain)
      ticks = extend.ticks
      //console.log("ext:", extend.domain, ticks, extend.height)
    }
    this.svgHeight = extend.height ? extend.height : 100

    const tickData = ticks.map(tick => ({
        val: tick,
        txt: numToTxt(tick),
        pos: Math.round(axisY(tick)*100)/100
    }))

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

export default connect(mapStateToProps, mapDispatchToProps)(AxisY)
