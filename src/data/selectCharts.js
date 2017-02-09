import {cfg_charts} from '../data/config'

export default function(feature) {
  //console.log(cfg_charts)

  const chartList = cfg_charts.filter(cfg => {
    //console.log("===")
    //console.log(cfg.chart)
    //console.log(cfg.value)

    /* check1: count */
    const cfgCountTypes = Object.keys(cfg.count)
    const isCountPassed = cfgCountTypes.filter(key => {
      //if (cfg.chart==="lineDiscrete") console.log(key, feature.count[key], cfg.count[key])
      return feature.count[key] >= cfg.count[key][0] && feature.count[key] <= cfg.count[key][1]
    }).length === cfgCountTypes.length

    /* check2: value */
    const cfgValueTypes = Object.keys(cfg.value)
    const isValuePassed = cfgValueTypes.filter(key => {
      const flag = typeof feature.value[key] !== 'number' ?
        feature.value[key] === cfg.value[key] :
        cfg.value[key].indexOf(feature.value[key]) > -1 // number_rangeType
      //if (key === "number_hasNull") console.log(flag, "<=", feature.value[key], cfg.value[key])
      return cfg.value[key] === null || flag
    }).length === cfgValueTypes.length
    //console.log("=>", cfg.chart, isValuePassed)

    //if (cfg.chart==="lineDiscrete") console.log("=>", isCountPassed, isValuePassed, isCountPassed && isValuePassed)
    return isCountPassed && isValuePassed
  }).map(cfg => cfg.chart)

  //console.log(chartList)
  return chartList
}
