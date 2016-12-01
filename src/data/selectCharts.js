import {cfg_charts} from '../data/config'

export default function(feature) {
  console.log(feature)

  const chartList = cfg_charts.filter(cfg => {
    console.log("===")
    console.log(cfg.chart)
    //console.log(cfg.value)

    /* check1: count */
    const cfgCountTypes = Object.keys(cfg.count)
    const isCountPassed = cfgCountTypes.filter(key => {
      console.log(key, feature.count[key], cfg.count[key])
      return feature.count[key] >= cfg.count[key][0] && feature.count[key] <= cfg.count[key][1]
    }).length === cfgCountTypes.length

    /* check2: value */
    const cfgValueTypes = Object.keys(cfg.value)
    const isValuePassed = cfgValueTypes.filter(key => {
      console.log(key, feature.value[key], cfg.value[key])
      return !cfg.value[key] || feature.value[key] === cfg.value[key]
    }).length === cfgValueTypes.length
    //console.log(isValuePassed)

    console.log("=>", isCountPassed && isValuePassed)
    return isCountPassed && isValuePassed
  }).map(cfg => cfg.chart)

  console.log(chartList)
  return chartList
}
