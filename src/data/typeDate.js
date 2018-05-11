/*
  dates has three types of values:
  - input with a list of format specifiers
  - scale in time (JS DATE format) or linear (NUMBER)
  - label as STRING in different formats
  ref:
  - https://docs.google.com/spreadsheets/d/1Y9_YUvjYvc0sRjKIUQDsmyQ8D656XYw0RsseQXBFnNQ
  - https://docs.google.com/spreadsheets/d/1Kw1M08x6yybOG8b7JxDvxIbtdffFzCsB0xQ7UuLuzh8/edit#gid=1819233225
*/

import {d3} from '../lib/d3-lite.js'

//const regexDateSeparators = /\/|-|\.|\s/g, the third part equaivalent to /\p{Sc}/

const formatList = [
  // time
  //"%m/%d/%Y", "%m/%d/%y",     // vs.
  //"%d/%m/%Y", "%d/%m/%y"      // extend
                                // -> parse sp.1 (*)
  "%d-%b-%y", "%d %b %Y",
  "%d %b",
  //"%Y%m%d",                   // -> parse sp.4
  "%Y-%m-%dT%H:%M:%S%Z",        // iso format timestamp
  "%m/%d/%y %H:%M",
  "%m/%d/%y %I:%M %p",
  "%H:%M:%S",                   // extend

  // linear
  //"%Y",                       // -> parse sp.2
  "%b-%y", "%b %y",             // hijack
  "%Y %b", "%b %Y",
  "%Y-%y", "%Y/%y",             // hijack
  "%b", "%B"                    // extend
  //"%Y Q*", "Q* %Y"            // -> parse sp.3
]

const formatSp1 = [
  "%m/%d/%y", "%m/%d/%Y"
]

/* 1. input format */
export function getDateAnalysis(data) {
  const dateFormat =
  testDateFormatSp1(data) ||
  testDateFormatSp2(data) ||
  testDateFormats(data, formatList, 5) ||
  testDateFormatSp3(data) ||
  testDateFormatSp4(data)
  //console.log("date format:", dateFormat ? dateFormat : null)

  const dateHasDay = dateFormat.indexOf("%d") > -1 || dateFormat.indexOf("%H") > -1
  return {
    valid: dateFormat ? true : false,
    format: dateFormat,
    hasDay: dateHasDay
  //scaleX: dateHasDay ? "time" : "linear",
  //values: getDateValues(dataClean, dateFormat, dateHasDay)
  }
}

function testDateFormats(data, formats, who) {
  let dateParser
  let dateFormat = formats.find(f => {
    dateParser = d3.timeParse(f)
    return dateParser(data[0])
  })

  return dateFormat && data.every(d => dateParser(d)) ? dateFormat : ""
}

// format(s): "%m/%d/%Y", "%m/%d/%y" vs. "%d/%m/%Y", "%d/%m/%y"
function testDateFormatSp1(data) {
  let format = testDateFormats(data, formatSp1, 1)
  if (format) {
    const isMonthFirst = data.every(d => d.split("/")[0] <= 12)
    const isDaySecond = data.some(d => d.split("/")[1] > 12)
    format = isMonthFirst && isDaySecond ? format : "%d/%m/" + format.slice(-2)

    // both first and second parts of are smaller than 12
    if (isMonthFirst && !isDaySecond) console.warn("format unclear!!!")
  }
  return format ? format : ""
}

// format(s): "%Y"
function testDateFormatSp2(data) {
  // format
  const format = "%Y"
  const isYear = testDateFormats(data, [format], 2) === format
  // filter, strict
  const is4Digits = data.every(d => d.length === 4)
  return isYear && is4Digits ? format : ""
}

// format(s): "%Y Q*", "Q* %Y"
function testDateFormatSp3(data) {
  // filter
  const isSp3 = data.every(d => (d[0] === "Q" || d[5] === "Q") && d.length === 7)
  // format without Q
  const dataYear = data.map(d => d.replace(/Q([1-4])/g, "").trim())
  const isYear = testDateFormats(dataYear, ["%Y"], 3) === "%Y"
  return isSp3 && isYear ? "Q*" : ""
}

// format(s): ""%Y%m%d""
function testDateFormatSp4(data) {
  // format
  const format = "%Y%m%d"
  const isYmd = testDateFormats(data, [format], 4) === format
  // filter, strict
  const isMonth = data.every(ymd => {const m = ymd.slice(4, 6); return m >= 1 && m <= 12})
  const isDay = data.every(ymd => {const d = ymd.slice(6); return d >= 1 && d <= 31})
  return isYmd && isMonth && isDay ? format : ""
}


/* 2. dates to scale values */
export function getDateScaleValues(dates, format, hasDay, isEditor = false) {
  let parser
  let getDateParsed = (parser) => dates.map(d => parser(d))

  switch (true) {
    /* d3.scaleLinear, return number */
    case ["%Y"].includes(format):
      return dates.map(d => +d)

    case ["Q*"].includes(format):
      const indexQ = dates[0].indexOf("Q")
      return dates.map(d => +(d.replace(/Q([1-4])/g, "").trim()) + ((+d[indexQ+1]) - 1)*0.25)

    case ["%Y-%y", "%Y/%y"].includes(format):
      return dates.map(d => +d.slice(0, 4))

    case ["%b", "%B"].includes(format):
      parser = d3.timeParse(!isEditor ? format : "%b")
      return getDateParsed(parser).map(d => d.getMonth())

    // %b %Y x 4 sets
    case !hasDay:
      parser = d3.timeParse(!isEditor ? format : "%b %Y")
      return getDateParsed(parser).map(d => d.getFullYear() + d.getMonth()/12)

    /* d3.scaleTime, return timestamp */
    default:
      parser = d3.timeParse(format)
      return getDateParsed(parser)
  }
}


/* 3. dates to label texts */
export function dateNumToTxt(value, format, hasDay) {
  let year = value.toString().split(".")[0]
  let deci = value % 1 // get decimal portion
  let date, month, toText

  switch (true) {

    case ["%Y"].includes(format):
      return value.toString()

    case ["Q*"].includes(format):
      const quad = (value % 1)*4 + 1
      return "Q" + quad + " " + year

    case ["%Y-%y", "%Y/%y"].includes(format):
      return value + "-" + (value+1).toString().slice(-2)

    case ["%b", "%B"].includes(format):
      date = new Date(2017, value)
      toText = d3.timeFormat("%b")
      return toText(date)

    // %b %Y x 4 sets
    case !hasDay:
      month = Math.round(parseFloat(deci*12))
      date = new Date(year, month || 0)
      toText = d3.timeFormat("%b %Y")
      //console.log(value, year, deci, month, date, toText(date))
      return toText(date)

    /* dynamic formats, see below */
    default:
      return null
  }
}

// dynamic
export function getDateTextFormat(domain) {

  const diffYear  = domain[1].getFullYear() - domain[0].getFullYear()
  const diffMonth = domain[1].getMonth() - domain[0].getMonth()
  const diffDay   = domain[1].getDate() - domain[0].getDate()
  const diffHour  = domain[1].getHours() - domain[0].getHours()

  switch (true) {
    case diffYear  > 4: return "%Y"       //console.log("[Y] 2017")
    case diffYear  > 0: return "%b %Y"    //console.log("[M] Feb 2017")
    case diffMonth > 4: return "%b"       //console.log("[M] Feb")
    case diffMonth > 0: return "%d %b"    //console.log("[M] 15 Feb")
    case diffDay   > 0: return "%d %I%p"  //console.log("[D] 15 6pm")
    case diffHour  > 0: return "%H:%M"    //console.log("[H] 18:30")
    default: console.error("a new time format is required!")
  }
}
