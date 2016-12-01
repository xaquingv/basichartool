import {d3} from '../lib/d3-lite.js'
import jsonBackup from '../assets/data/config'

// source: https://docs.google.com/spreadsheets/d/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8/edit#gid=1881209151
const url = 'https://interactive.guim.co.uk/docsdata-test/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8.json'

export let colors, cfg_charts

export default function() {
  // TODO: maybe switch fetch
  //if (self.fetch) {console.log("fetch is working")}

  d3.json(url, (err, json) => {
    //console.log(err, json)

    if (err) {
      console.error("Ohoh! backup config file is used due to ...", err)
      parseCfgJson(jsonBackup)
    } else {
      console.log("Good, config file is properly loaded from spreadsheet!")
      parseCfgJson(json.sheets)
    }
  })
}

function parseCfgJson(cfg) {

  /* colors: guardian's pre-defined colors */
  colors = cfg.colors.sort((c1, c2) => c1.order - c2.order).map(c => c.code)

  /* charts: cfg for chart selection
  // TODO: sort by order and filter by on/off flag */
  cfg_charts = cfg.cfg_charts.filter(chart => chart.id).map(chart => {
    // 1. count
    let count = {
      row: JSON.parse(chart.row.replace("Infinity", '"Infinity"'))
    };
    ["date", "number", "string1", "string2"].forEach(type => {
      count[type] = JSON.parse(chart[type])
    })
    // 2. value
    const {date_hasRepeat, string1_hasRepeat, string1_format, numberH_format} = chart
    const value = {
      date_hasRepeat,
      string1_hasRepeat, string1_format,
      number_rangeType: +chart.number_rangeType,
      numberH_format
    }

    return {
      chart: chart.id,
      count,
      value
    }
  })

  console.log(colors, cfg_charts)
}
