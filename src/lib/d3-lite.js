//import {queue} from 'd3-queue'
import {json} from 'd3-request'
import {select, selectAll, mouse, event} from 'd3-selection'
import {dispatch} from 'd3-dispatch'
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
  mouse,
  event,
  dispatch,
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

/* To distinguish click and double-click in D3 */
// ref: https://github.com/d3/d3/blob/v3.5.17/src/core/rebind.js
// ref: http://bl.ocks.org/timpulver/d3fefb4fac2510cf81a8
/*d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

export function clickcancel() {
  var event = d3.dispatch('click', 'dblclick');

  function cc(selection) {
    console.log(selection);
    var down,
      tolerance = 5,
      last,
      wait = null;

    // euclidean distance
    function dist(a, b) {
      return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
    }

    selection.on('mousedown', function() {
      down = d3.mouse(document.body);
      last = +new Date();
    });

    selection.on('mouseup', function() {
      if (dist(down, d3.mouse(document.body)) > tolerance) {
        return;
      } else {
        if (wait) {
          window.clearTimeout(wait);
          wait = null;
          event.dblclick(d3.event);
        } else {
          wait = window.setTimeout((function(e) {
            return function() {
              event.click(e);
              wait = null;
            };
          })(d3.event), 300);
        }
      }
    });
  };

  return d3.rebind(cc, event, 'on');
}*/
