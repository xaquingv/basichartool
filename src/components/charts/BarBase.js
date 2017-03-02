import React from 'react'
import {connect} from 'react-redux'


const mapStateToProps = (state) => ({
  data: state.dataChart,
})

const mapDispatchToProps = (dispatch) => ({
})


class Row extends React.Component {

  render() {
    const {data, isLabel, label, width} = this.props
    const isInline = !data.string1IsRes

    const labelComponent = isLabel
    ? (
      <div className="label" style={{
        display: "inline-block",
        width: width
      }}>{label}</div>
    )
    : null

    const groupComponent =
      <div className="group" style={{
        display: (isInline && isLabel) ? "inline-block" : "block",
        width: (isInline && isLabel) ? "calc(" + 100 + "% - " + width + "px)" : "100%",
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
