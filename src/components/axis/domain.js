import {d3} from '../../lib/d3-lite'

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

  // exent
  if (domain[0] < ticks[0]) {
    const diff = ticks[1] - ticks[0]
    extTicks = [ticks[0] - diff].concat(ticks)
    extDomain[0] = extTicks[0]
  }

  const height = Math.round(((domain[1] - domain[0]) / (extDomain[1] - extDomain[0]))*10000)/100

  //console.log("pre", domain, ticks)
  //console.log("cur", extDomain, extTicks, height)
  return {
    domain: extDomain,
    ticks: extTicks,
    height
  }
}
