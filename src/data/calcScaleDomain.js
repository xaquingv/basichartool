import {d3} from '../lib/d3-lite'
import {ratio} from './config'

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
export function getDomainExtend(domain, ticks) {

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
  if (domain[1] - ticks[last] > diff/3) {
    extTicks = extTicks.concat(ticks[last] + diff)
    extDomain[1] = extTicks[extTicks.length-1]
  }

  // max ticks number 8
  const step = Math.ceil(extTicks.length / 8)
  extTicks = extTicks.filter((t, i) => i%step ===0)

  const height = Math.round(((domain[1] - domain[0]) / (extDomain[1] - extDomain[0]))*10000)/100
  const marginTop = Math.round(((extDomain[1] - domain[1]) / (extDomain[1] - extDomain[0]))*10000)*ratio/100

  //console.log("pre", domain, ticks)
  //console.log("cur", extDomain, extTicks, height, marginTop)
  return {
    domain: extDomain,
    ticks: extTicks,
    height,
    marginTop
  }
}
