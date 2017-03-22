import {cfg_charts} from '../data/config'
// ref of config file: https://docs.google.com/spreadsheets/d/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8/edit#gid=1881209151

export default function(feature) {
  //console.log(cfg_charts)
  const cfgCountTypes = Object.keys(cfg_charts[0].count)
  const cfgValueTypes = Object.keys(cfg_charts[0].value)

  const chartList = cfg_charts.filter(cfg => {

    /* check1: count of each data types */
    const isCountPassed = cfgCountTypes.filter(key => {
      //if (cfg.chart==="lineDiscrete") console.log(key, feature.count[key], cfg.count[key])
      return feature.count[key] >= cfg.count[key][0] && feature.count[key] <= cfg.count[key][1]
    }).length === cfgCountTypes.length

    /* check2: value of some data types' attribute */
    const isValuePassed = cfgValueTypes.filter(key => {
      const flag = typeof feature.value[key] !== 'number' ?
        feature.value[key] === cfg.value[key] :
        cfg.value[key].indexOf(feature.value[key]) > -1 // number_rangeType
      //if (key === "number_hasNull") console.log(flag, "<=", feature.value[key], cfg.value[key])
      return cfg.value[key] === null || flag
    }).length === cfgValueTypes.length

    //if (cfg.chart==="lineDiscrete") console.log("=>", isCountPassed, isValuePassed, isCountPassed && isValuePassed)
    return isCountPassed && isValuePassed
  }).map(cfg => cfg.chart)

  //console.log("features:", cfgCountTypes, cfgValueTypes)
  //console.log(chartList)
  return chartList
}
