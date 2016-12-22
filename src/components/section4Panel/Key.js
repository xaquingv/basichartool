import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Key extends React.Component {

  render() {

    const keys = this.props.dataChart.keys
    const keyLen = keys.length

    let drawKeys = null
    // TODO: add contentEditable component to label spans

    if (keyLen === 1) {

      drawKeys = <span>{keys}</span>

    } else if (keyLen > 1) {

      drawKeys = keys.map((label, i) =>
        <div className="key">
          <span className="key-color" style={{backgroundColor: colors[i]}}></span>
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
