import LineDiscrete       from './charts/LineDiscrete'
import LineContinue     from './charts/LineContinue'
import PlotDot            from './charts/PlotDot'
import PlotScatter        from './charts/PlotScatter'
import Slopegraph         from './charts/Slopegraph'
import Bars               from './charts/Bars'
import BarStack           from './charts/BarStack'
import BarStack100        from './charts/BarStack100'
import Bars100            from './charts/Bars100'
import BrokenBar100       from './charts/BrokenBar100'
import OnBarArrow         from './charts/OnBarArrow'
import OnBarDots          from './charts/OnBarDots'
import OnBarTicks         from './charts/OnBarTicks'
import Cols               from './charts/Cols'
import ColStack           from './charts/ColStack'
import AreaStack          from './charts/AreaStack'
//import ColHistogram
//import ColMatrix
//import LineContiWithPlot  from './charts/LineContiWithPlot'
//import MapChoropleth      from './charts/MapChoropleth'
//import MapBubble          from './charts/MapBubble'
//import Donut              from './charts/Donut'
//import Treemap

// TODO: obj -> arr, sort by config file
export const chartList = {
  plotScatter:      PlotScatter,
  lineContinue:     LineContinue,
  lineDiscrete:     LineDiscrete,
  plotDot:          PlotDot,
  onBarDiffArrow:   OnBarArrow,
  onBarDiffDots:    OnBarDots,
  onBarTicks:       OnBarTicks,
  bar:              Bars,
  barGroup:         Bars,
  barGroupStack:    BarStack,
  barGroupStack100: BarStack100,
  bar100:           Bars100,
  brokenBar100:     BrokenBar100,
  col:              Cols,
  colGroup:         Cols,
  colGroupStack:    ColStack,
  //colGroupStack100: AreaStack,
  areaGroupStack:   AreaStack,
  slopegraph:       Slopegraph,
  //donut:          Donut,
  //mapChoropleth:  MapChoropleth,
  //mapBubble:      MapBubble
}
