import {queue} from 'd3-queue'
import {timeFormat, timeParse} from 'd3-time-format'
import {select, selectAll} from 'd3-selection'
import {geoPath} from 'd3-geo'
import {geoKavrayskiy7} from 'd3-geo-projection'
import {scaleQuantize, scaleQuantile, scaleSqrt} from 'd3-scale'

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
  scaleSqrt
}

//console.log(d3)
