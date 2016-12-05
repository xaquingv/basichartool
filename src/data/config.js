import {d3} from '../lib/d3-lite.js'
import jsonBackup from '../assets/data/config'

// source: https://docs.google.com/spreadsheets/d/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8/edit#gid=1881209151
const url = 'https://interactive.guim.co.uk/docsdata-test/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8.json'

export let colors, colorBarBackground
export let cfg_charts

export default function() {
  // TODO: maybe switch fetch
  //if (self.fetch) {console.log("fetch is working")}

  d3.json(url, (err, json) => {
    //console.log(err, json)

    if (err) {
      console.log("Ohoh! backup config file is used due to ...", err)
      parseCfgJson(jsonBackup)
    } else {
      console.log("Good, config file is properly loaded from spreadsheet!")
      //console.log(json.sheets)
      parseCfgJson(json.sheets)
    }
  })
}

function parseCfgJson(cfg) {

  /* colors: guardian's pre-defined colors */
  colors = cfg.colors
  .filter(c => c.type === "all")
  .sort((c1, c2) => c1.order - c2.order).map(c => c.code)

  colorBarBackground = cfg.colors.find(c => c.type === "barBackground").code || "#f1f1f1"

  // TODO: add map colors, see mapData.js


  /* charts: cfg for chart selection
  // TODO: sort by order and filter by on/off flag */
  cfg_charts = cfg.cfg_charts.filter(chart => chart.id).map(chart => {

    // 1. count => 5 features
    let count = {
      row: JSON.parse(chart.row.replace("Infinity", '"Infinity"'))
    };
    ["date", "number", "string1", "string2"].forEach(feature => {
      count[feature] = JSON.parse(chart[feature])
    })

    // 2. value => 5 features
    const value = {
    //string1_format: chart.string1_format.trim() !== "" ? chart.string1_format : null,
      numberH_format: chart.numberH_format.trim() !== "" ? chart.numberH_format : null
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

  //console.log(colors, cfg_charts)
}
