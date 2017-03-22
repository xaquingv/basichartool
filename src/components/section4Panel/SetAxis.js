import React from 'react'
import {connect} from 'react-redux'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  step: state.step,
  dataEditable: state.dataEditable,
  dataChart: state.dataChart
})

const mapDispatchToProps = (dispatch) => ({
})


class SetAxis extends React.Component {

  render() {
    const {id, step, type, dataEditable} = this.props
    if (step !== 4 || !dataEditable.axis) {return null}

    // display config ref:
    // https://docs.google.com/spreadsheets/d/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8/edit#gid=1568229560
    const hasEditorAxisT = {
      x: (id.indexOf("col") === -1) && (id.indexOf("slope") === -1),
      y: (id.toLowerCase().indexOf("bar") === -1) && (id.indexOf("slope") === -1)
    }
    const hasEditorRange = {
      x: (id.indexOf("plot") > -1) || (id.indexOf("onBar") > -1),
      y: (id.indexOf("plot") > -1) || (id.indexOf("line") > -1)
    }
    if (!hasEditorAxisT && !hasEditorRange) {return null}

    const axisT = dataEditable.axis[type]
    const ticks = /*axisT.isDate ? axisT.texts.join(", ") :*/ axisT.ticks.join(", ")
    const range = axisT.range.join(", ")
    if (axisT.isDate) {
      console.log("TODO: map ticks with texts", id)
      console.log("[str]", axisT.ticks.map(i => this.props.dataChart.dateString[i]))
      console.log("[txt]", axisT.texts)
      console.log("[tic]", axisT.ticks)
      console.log(this.props.dataChart.dateString)
    }

    //console.log("("+id+")", type+"-axis:", hasEditorAxisT[type], "range:", hasEditorRange[type])
    const editorRange = hasEditorRange[type]
    ? (
      <span className="ws-n">
        <span className="mr-10">Range:</span>[
        <ComponentEditor text={range} type={type+"Range"} />]
      </span>
    ) : null

    return hasEditorAxisT[type]
    ? (
      <div>
        <span className="ws-pl">
          <span className="mr-10">{type.toUpperCase()}-Ticks:</span>
          <ComponentEditor text={ticks} type={type+"Ticks"} />
          {hasEditorRange[type] ? <span className="">; </span> : null}
        </span>
        {editorRange}
      </div>
    ) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetAxis)
