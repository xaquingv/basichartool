import React from 'react'
import {connect} from 'react-redux'
//import {updateSize} from '../../actions'


const mapStateToProps = (state) => ({
  size: state.dataSetup.size,
  width: state.dataSetup.width
})

const mapDispatchToProps = (dispatch) => ({
})


class Display extends React.Component {

  render() {
    const {size, width} = this.props
    
    return (
      <div>Width * Height: {width + (width === "100%" ? " width" : " * " + size.h + "px")}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Display)
