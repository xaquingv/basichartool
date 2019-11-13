import {d3} from '../lib/d3-lite.js'
import jsonBackup from '../assets/data/config'

// source: https://docs.google.com/spreadsheets/d/1mJv_TmNyYiQ_IGx-yt0kJQggDCPAjRn1TCRpe34VW0g/edit#gid=2136298642
const url = ""

export const ratio = 0.6
export const width = 300
export const height = width*ratio
export const viewBox = "0 0 " + width + " " + height

export let cfg_charts
export let colors, colorBarBackground
export let metaKeys, default_metaText = {}
export let chartNames = {}, chartInfos = {}


export default function() {
  // TODO: maybe switch to fetch
  //if (self.fetch) {console.log("fetch is working")}

  d3.json(url, (err, json) => {
    //console.log(err, json)

    if (err) {
      console.log("Local config file is in the house :)"/*, err*/)
      parseCfgJson(jsonBackup)
    } else {
      console.log("Good, config file is properly loaded from spreadsheet!")
      //console.log(json.sheets)
      parseCfgJson(json.sheets)
      //parseCfgJson(jsonBackup)
    }
  })
}

function parseCfgJson(cfg) {

  /* colors: pre-defined colors */
  colors = cfg.COLORS
  .filter(c => c.type === "all")
  .sort((c1, c2) => c1.order - c2.order).map(c => c.code)

  colorBarBackground = cfg.COLORS
  .find(c => c.type === "barBackground").code || "#f1f1f1"

  // TODO: add map colors, see mapData.js
  // ...

  /* charts: cfg for chart selection */
  cfg_charts = cfg.CFG_CHARTS
  .filter(chart => JSON.parse(chart.active)) // filter by on/off flag
  .sort((chartA, chartB) => chartA.seq - chartB.seq) // sort by order
  .map(chart => {

    // 1. count => 5 features:
    // row, date, number, string1, string2
    let count = {
      row: JSON.parse(chart.row.replace("Infinity", '"Infinity"'))
    };
    ["date", "number", "string1", "string2"].forEach(feature => {
      count[feature] = JSON.parse(chart[feature])
    })

    // 2. value => 5 features:
    // date_hasRepeat, number_hasNull, number_rangeType, numberH_format, string1_hasRepeat
    const value = {
      numberH_format: chart.numberH_format.trim() !== "" ? chart.numberH_format : null
    //string1_format: chart.string1_format.trim() !== "" ? chart.string1_format : null
    };
    ["date_hasRepeat", "string1_hasRepeat", "number_hasNull", "number_rangeType"].forEach(feature => {
      value[feature] = chart[feature].trim() !== "" ? JSON.parse(chart[feature]) : null
    })

    return {
      chart: chart.id,
      count,
      value
    }
  })

  cfg.CFG_CHART_DEF
  .filter(chart => chart.seq)
  .forEach(chart => {
    chartNames[chart.id] = chart.name
    chartInfos[chart.id] = { task: chart.task,  description: chart.description} 
  })


  /* meta data for chart editing */
  metaKeys = cfg.METAKEYS;
  
  const metaText = cfg.METATEXT
  metaKeys.forEach((key, idx) => default_metaText[key] = metaText[idx]) 
}