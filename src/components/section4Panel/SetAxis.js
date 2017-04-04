import React from 'react'
import {connect} from 'react-redux'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  step: state.step,
  dataEditable: state.dataEditable
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

    const dataT = dataEditable.axis[type]
    const axisT = dataT.edits ? dataT.edits : dataT
    const range = axisT.range.join(", ")
    const ticks = axisT.ticks.join(", ")

    const editorRange = (
      <span className={"ws-n" + (hasEditorRange[type] ? "" : " o-disable")}>
        <span className="mr-10">Range:</span>
        [{hasEditorRange[type] ? <ComponentEditor text={range} type={type+"Range"} /> : range}]
      </span>
    )

    return hasEditorAxisT[type]
    ? (
      <div>
        <span className="ws-pl">
          <span className="mr-10">{type.toUpperCase()}-Ticks:</span>
          <ComponentEditor text={ticks} type={type+"Ticks"} />
          <span>; </span>
        </span>
        {editorRange}
      </div>
    ) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetAxis)
