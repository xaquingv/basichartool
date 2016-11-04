import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css';

import MapChoropleth      from './charts/MapChoropleth'
import MapBubble          from './charts/MapBubble'
import AreaStack100       from './charts/AreaStack100'
import LineDiscrete       from './charts/LineDiscrete'
import LineContinuous     from './charts/LineConti'
import LineContiWithPlot  from './charts/LineContiWithPlot'
import DotPlot            from './charts/DotPlot'
import ScatterPlot        from './charts/ScatterPlot'
import Slope              from './charts/SlopeWithPlotLine'
import Donut              from './charts/Donut'
import Cols               from './charts/Cols'
import ColStack           from './charts/ColStack'
import Bars               from './charts/Bars'
import BarStack           from './charts/BarStack'
import BarStack100        from './charts/BarStack100'
import Bar100             from './charts/Bar100'
import BarBroken          from './charts/BarBroken'
import ArrowOnBar         from './charts/ArrowOnBar'
import DotPlotOnBar       from './charts/DotPlotOnBar'
import TickOnBar          from './charts/TickOnBar'
//import treemap

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
        <h1>3. Select a visualization</h1>
        <div className="charts">
          <div id="mapChoropleth"><MapChoropleth />    Map choropleth          </div>
          <div id="mapBubble">    <MapBubble />        Map bubble              </div>
          <div id="slope">        <Slope />            Slope                   </div>
          <div id="arrowOnBar">   <ArrowOnBar />       Arrow on bar            </div>
          <div id="dotPlotOnBar"> <DotPlotOnBar />     Dot plot on bar         </div>
          <div id="tickOnBar">    <TickOnBar />        Ticks on bar            </div>
          <div id="lineDiscrete"> <LineDiscrete />     Line (discrete)         </div>
          <div id="lineConti">    <LineContinuous />   Line (conti.)           </div>
          <div id="lineContiPlot"><LineContiWithPlot />Line + dot plots        </div>
          <div id="dotPlot">      <DotPlot />          Dot plots               </div>
          <div id="scatterPlot">  <ScatterPlot />      Scatter plots           </div>
          <div id="areaStack100"> <AreaStack100 />     Area stacked            </div>
          <div id="cols">         <Cols />             Cols                    </div>
          <div id="colStack">     <ColStack />         Col stack               </div>
          <div id="bars">         <Bars />             Bars                    </div>
          <div id="barStack">     <BarStack />         Bar stack               </div>
          <div id="barStack100">  <BarStack100 />      Bar stack 100%          </div>
          <div id="barBroken">    <BarBroken />        Bar broken              </div>
          <div id="bar100">       <Bar100 />           Bar 100%                </div>
          <div id="donut">        <Donut />            Donut                   </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)
