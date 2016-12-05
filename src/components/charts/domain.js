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
