// string
// number: 1,000, 100m, %, currency
// date: ...
// https://en.wikipedia.org/wiki/Decimal_mark
// https://en.wikipedia.org/wiki/Date_format_by_country
import {uniqueArray} from '../lib/array'
import {getDateAnalysis} from './typeDate'
import {getNumberAnalysis} from './typeNumber'


export default function(dataArr = "", src) {

  /* data */
  // remove missing data if data src is from table body
  let data = { types:[] };
  let dataClean = src === "body" ? dataArr.filter(data => data) : dataArr;


  /* date format */
  const dataDate = getDateAnalysis(dataClean)
  if (dataDate.valid) {
    data.types.push("date")
    data.date = {
      format: dataDate.format,
      hasDay: dataDate.hasDay
    }
  }

  /* number format */
  const dataNumber = getNumberAnalysis(dataClean)
  if (dataNumber.valid) {
    data.types.push("number")
    data.number = {
      format: dataNumber.format ? dataNumber.format : "",
    //values: dataNumber.values
    }
  }

  /* string format */
  // add string format if number with format or number only
  if (!dataNumber.format && data.types.join() !== "number") {
    const uniqueLen = uniqueArray(dataClean).length
    const hasRepeat = dataClean.length !== uniqueLen

    if (hasRepeat && uniqueLen > 1 && uniqueLen <= 10) {
      // uniqueLen, due to 10 colors
      // string for grouping
      data.types.push("string2")
      data.string2 = {
        format: null
      }
    } else {
      // string for axis or map
      data.types.push("string1")
      data.string1 = {
        // TODO: format: ...
        // for maps and histogram: code/name, bins, or null
        format: null,
        hasRepeat: hasRepeat
      }
    }
  }

  // data type priority: 1. date -> 2.number -> 3.string*
  data.types.sort()
  //console.log("=>", data.types[0])
  //console.log(data)
  return data
}
