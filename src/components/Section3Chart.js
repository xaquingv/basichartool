import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css';

import MapChoropleth      from './charts/MapChoropleth'
import MapBubble          from './charts/MapBubble'
import LineDiscrete       from './charts/LineDiscrete'
import LineContinuous     from './charts/LineConti'
import LineContiWithPlot  from './charts/LineContiWithPlot'
import ScatterPlot        from './charts/ScatterPlot'
import AreaStack100       from './charts/AreaStack100'

const STEP = 3
const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
})


class Section extends React.Component {
  render() {
    const {stepActive} = this.props

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section3">
        <h1>3. Select a visulaization</h1>
        <div>
          <MapChoropleth />
          <MapBubble />
          <LineDiscrete />
          <LineContinuous />
          <LineContiWithPlot />
          <ScatterPlot />
          <AreaStack100 />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)
