import React from 'react'
import {connect} from 'react-redux'
import {dropColorTo} from '../../actions'


const mapStateToProps = (state) => ({
  dataSetup: state.dataSetup
})

const mapDispatchToProps = (dispatch) => ({
  onDropColor: (i) => dispatch(dropColorTo(i))
})


class Legend extends React.Component {

  render() {
    const {dataSetup, onDropColor} = this.props

    const legend = dataSetup.legend
    const length = legend.length
    const colors = dataSetup.colors
    const display = dataSetup.display.legend

    let drawKeys = null
    // TODO: add contentEditable component to label spans

    if (length === 1) {
      drawKeys = <span>{legend}</span>

    } else if (length > 1) {
      drawKeys = legend.map((label, i) =>
        <div className="legend-item" key={i}>
          <span className="legend-color" style={{backgroundColor: colors[i]}} onClick={()=>onDropColor(i)}></span>
          <span className="legend-label">{label}</span>
        </div>
      )
    }

    return (
      <div className={"legend" + (display ? "" : " d-n")}>{drawKeys}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
