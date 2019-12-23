import {d3} from '../lib/d3-lite'
//import {ratio} from './config'

// bars
export function getDomainByDataRange(dataArr) {
  const domain = d3.extent(dataArr)

  if (domain[0] > 0) {
    domain[0] = 0
  } else if (domain[1] < 0) {
    domain[1] = 0
  }

  return domain
}

// line
//export function getDomainExtent(dataArr) {}

// axis_y_number
export function getDomainExtend(domain, ticks/*, yRange*/) {

  let extDomain = domain.slice()
  let extTicks = ticks.slice()

  // extent
  const diff = ticks[1] - ticks[0]
  const last = ticks.length-1
  // bottom
  if (domain[0] < ticks[0]) {
    extTicks = [ticks[0] - diff].concat(ticks)
    extDomain[0] = ticks[0] - diff//.concat(ticks)
  }
  // top
  // TODO: should not extent
  if (domain[1] - ticks[last] > diff/3) {
    extTicks = extTicks.concat(ticks[last] + diff)
    extDomain[1] = extTicks[extTicks.length-1]
  }

  // max ticks number 8
  const step = Math.ceil(extTicks.length / 8)
  extTicks = extTicks.filter((t, i) => i%step ===0)

  //console.log("===")
  //console.log("[pre]", domain, ticks)
  //console.log("[cur]", extDomain, extTicks)
  return {
    // to avoid float precision issue in domian and ticks
    domain: extDomain.map(d => parseFloat(d.toFixed(8))),
    ticks: extTicks.map(t => parseFloat(t.toFixed(8))),
  }
}
