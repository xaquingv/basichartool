//import {queue} from 'd3-queue'
import {json} from 'd3-request'
import {timeFormat, timeParse} from 'd3-time-format'
import {select, selectAll} from 'd3-selection'
import {geoPath} from 'd3-geo'
import {geoKavrayskiy7} from 'd3-geo-projection'
import {scaleQuantize, scaleQuantile, scaleSqrt, scaleLinear, scaleTime, scaleBand} from 'd3-scale'
import {extent, quantile} from 'd3-array'
import {line, arc, area, stack, pie, curveStep, curveStepBefore} from 'd3-shape'

export const d3 = {
  //queue,
  json,
  timeFormat,
  timeParse,
  select,
  selectAll,
  geoPath,
  geoKavrayskiy7,
  scaleQuantize,
  scaleQuantile,
  scaleSqrt,
  scaleLinear,
  scaleTime,
  scaleBand,
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
