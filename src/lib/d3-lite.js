//import {queue} from 'd3-queue'
import {json} from 'd3-request'
import {select, selectAll} from 'd3-selection'
import {timeFormat, timeParse} from 'd3-time-format'
import {scaleLinear, scaleTime, scaleQuantize, scaleQuantile, scaleSqrt, scaleBand, scaleOrdinal} from 'd3-scale'
//import {axisBottom} from 'd3-axis'
import {extent, quantile} from 'd3-array'
import {line, arc, area, stack, pie, curveStep, curveStepBefore} from 'd3-shape'
import {geoPath} from 'd3-geo'
import {geoKavrayskiy7} from 'd3-geo-projection'

export const d3 = {
  //queue,
  json,
  timeFormat,
  timeParse,
  select,
  selectAll,
  geoPath,
  geoKavrayskiy7,
  scaleTime,
  scaleLinear,
  scaleSqrt,
  scaleOrdinal,
  scaleQuantize,
  scaleQuantile,
  scaleBand,
  //axisBottom,
  extent,
  quantile,
  line,
  area,
  arc,
  stack,
  pie,
  curveStepBefore,
  curveStep
}

//console.log(d3)
