import React from 'react'
import {connect} from 'react-redux'
import MapChoropleth from './charts/MapChoropleth'
import MapBubble from './charts/MapBubble'

const STEP = 3
const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
})


class Section extends React.Component {
  render() {
    const {stepActive} = this.props
    //console.log("step: 3", this.props)

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section3">
        <h1>3. Select a visulaization</h1>
        <div>
          <MapChoropleth />
          <MapBubble />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)
