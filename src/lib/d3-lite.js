import {queue} from 'd3-queue'
import {timeFormat, timeParse} from 'd3-time-format'
import {select, selectAll} from 'd3-selection'
import {geoPath} from 'd3-geo'
import {geoKavrayskiy7} from 'd3-geo-projection'
import {scaleQuantize, scaleQuantile, scaleSqrt, scaleLinear, scaleTime} from 'd3-scale'
import {extent} from 'd3-array'
import {line, area, stack} from 'd3-shape'

export const d3 = {
  queue,
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
  extent,
  line,
  area, 
  stack
}

//console.log(d3)
