import React from 'react'
import {connect} from 'react-redux'
import ComponentEditor from '../section4Panel/Editor'


const mapStateToProps = (state) => ({
  isInline: !state.dataChart.string1IsRes,
  labelWidth: state.dataChart.string1Width
})

const mapDispatchToProps = (dispatch) => ({
})


class Row extends React.Component {

  render() {
    const {isInline, isLabel, label, labelWidth} = this.props

    const labelComponent = isLabel
    ? (
      <div className="label" style={{
        display: "inline-block",
        width: labelWidth
      }}>
        <ComponentEditor text={label} type="yLabel"/>
      </div>
    )
    : null

    const groupComponent =
      <div className="group" style={{
        display: (isInline && isLabel) ? "inline-block" : "block",
        width: (isInline && isLabel) ? "calc(" + 100 + "% - " + labelWidth + "px)" : "100%",
        position: "relative"
      }}>
        <div className="grid"></div>
        <div className="bars"></div>
      </div>

    return (
      <div className="row" style={{
        height: isInline ? "24px" : "auto"
      }}>
        {labelComponent}
        {groupComponent}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Row)
