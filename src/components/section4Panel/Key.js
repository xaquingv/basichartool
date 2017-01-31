import React from 'react'
import {connect} from 'react-redux'
import {dropColorTo} from '../../actions'


const mapStateToProps = (state) => ({
  dataSetup: state.dataSetup
})

const mapDispatchToProps = (dispatch) => ({
  onDropColor: (i) => dispatch(dropColorTo(i))
})


class Key extends React.Component {

  render() {
    const {dataSetup, onDropColor} = this.props

    const keys = dataSetup.legend
    const keyLen = keys.length
    const colors = dataSetup.colors

    let drawKeys = null
    // TODO: add contentEditable component to label spans

    if (keyLen === 1) {
      drawKeys = <span>{keys}</span>

    } else if (keyLen > 1) {
      drawKeys = keys.map((label, i) =>
        <div className="key" key={i}>
          <span className="key-color" style={{backgroundColor: colors[i]}} onClick={()=>onDropColor(i)}></span>
          <span className="key-label">{label}</span>
        </div>
      )
    }

    return (
      <div className="keys" ref="keys">{drawKeys}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Key)
