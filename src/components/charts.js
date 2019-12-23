import LineDiscrete       from './charts/LineDiscrete'
import LineContinue     from './charts/LineContinue'
import PlotDot            from './charts/PlotDot'
import PlotScatter        from './charts/PlotScatter'
// import Slopegraph         from './charts/Slopegraph'
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
import ColStack100        from './charts/ColStack100'
import AreaStack          from './charts/AreaStack'
//import ColHistogram
//import ColMatrix
//import LineContiWithPlot  from './charts/LineContiWithPlot'
//import MapChoropleth      from './charts/MapChoropleth'
//import MapBubble          from './charts/MapBubble'
//import Donut              from './charts/Donut'
//import Treemap

// TODO: obj -> arr, sort by config file
export const chartComponents = {
  plotScatter:      PlotScatter,  // 1
  lineContinue:     LineContinue, // 2
  lineDiscrete:     LineDiscrete, // 3
  plotDot:          PlotDot,      // 4
  onBarDiffArrow:   OnBarArrow,   // 5
  onBarDiffDots:    OnBarDots,    // 6
  onBarTicks:       OnBarTicks,   // 7
  bar:              Bars,         // 8
  barGroup:         Bars,         // 9
  barGroupStack:    BarStack,     // 10
  barGroupStack100: BarStack100,  // 11
  bar100:           Bars100,      // 12
  brokenBar100:     BrokenBar100, // 13
  col:              Cols,         // 14
  colGroup:         Cols,         // 15
  colGroupStack:    ColStack,     // 16
  colGroupStack100: ColStack100,  // 17
  areaGroupStack:   AreaStack,    // 18
  //slopegraph:       Slopegraph, // 19
  //donut:          Donut,        // 20 ...
  //mapChoropleth:  MapChoropleth,
  //mapBubble:      MapBubble
}
