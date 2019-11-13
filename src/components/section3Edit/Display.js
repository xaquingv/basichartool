import React from 'react'
import {connect} from 'react-redux'
import {metaKeys} from '../../data/config'
import {updateDisplay} from '../../actions'


const mapStateToProps = (state) => ({
  display: state.dataSetup.display
})

const mapDispatchToProps = (dispatch) => ({
  onSwitchDisplay: (key) => dispatch(updateDisplay(key))
})


class Display extends React.Component {

  render() {
    const {onSwitchDisplay, display} = this.props

    const defaultDisplaySwitches = metaKeys.map((key, i) =>
      <span key={key} className={"display-separator"}>
        <span
          onClick={()=>onSwitchDisplay(key)}
          className={"display-item" + (display[key] ? "" : " display-off")}
        >{key}</span>
      </span>
    )

    return display ? (
      <div className="display">Display:{defaultDisplaySwitches}</div>
    ): null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Display)
