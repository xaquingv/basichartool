import AreaStack100       from './charts/AreaStack100'
import LineDiscrete       from './charts/LineDiscrete'
import LineContinuous     from './charts/LineConti'
import DotPlot            from './charts/DotPlot'
import ScatterPlot        from './charts/ScatterPlot'
import Slope              from './charts/SlopeWithPlotLine'
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
//import ColHistogram
//import ColMatrix
//import LineContiWithPlot  from './charts/LineContiWithPlot'
//import MapChoropleth      from './charts/MapChoropleth'
//import MapBubble          from './charts/MapBubble'
//import Donut              from './charts/Donut'
//import Treemap

// TODO: obj -> arr, sort by config file
export const chartList = {
  lineDiscrete:  LineDiscrete,
  lineConti:     LineContinuous,
  dotPlot:       DotPlot,
  scatterPlot:   ScatterPlot,
  slope:         Slope,
  diffArrow:     ArrowOnBar,
  diffDot:       DotPlotOnBar,
  tickPlot:      TickOnBar,
  bar:           Bars,
  barGroup:      Bars,
  barGStack:     BarStack,
  barGStack100:  BarStack100,
  bar100:        Bar100,
  barBroken:     BarBroken,
  col:           Cols,
  colGroup:      Cols,
  colGStack:     ColStack,
  colGStack100:  AreaStack100
  //areaStack100:  AreaStack100,
  //donut:         Donut,
  //mapChoropleth: MapChoropleth,
  //mapBubble:     MapBubble
}
