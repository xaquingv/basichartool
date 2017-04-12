import React from 'react'
import {connect} from 'react-redux'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  indent: state.dataChart.indent,
  labels: state.dataChart.rowGroup
})

const mapDispatchToProps = (dispatch) => ({
})


class LabelX extends React.Component {

  render() {
    if (!this.props.id.includes("col")) return null

    /* data */
    const {indent, labels} = this.props
    const length = labels.length
    //TODO: pixel perfect fix!?
    const padding = 2
    const band = (100 - padding*(length-1)) / length

    /* draw */
    const drawAxisTexts = labels.map((label, i) =>
      <div key={"text" + i}
        className="label"
        style={{
          position: "absolute",
          top: "8px",
          left: (band + padding) * i + "%",
          width: band + "%",
          lineHeight: "14px",
          paddingTop: "2px",
          textAlign: "left"
        }}
      >
        <ComponentEditor text={label} type="xLabel" />
      </div>
    )

    return (
      <div className="label-x"
        data-x-bottom={true}
        data-y-indent={indent}
      style={{
        position: "absolute",
        top: "calc(100% - 1px)", // due to svg padding: 1px
        right: 0,
        width: "calc(100% - " + indent + "px)",
      }}>
        {drawAxisTexts}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelX)
