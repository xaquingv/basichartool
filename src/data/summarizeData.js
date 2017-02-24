import {uniqueArray, swapArray} from '../lib/array'
import {width} from '../data/config'
import getDataType from './detectDataType'
import {getDateScaleValues} from './typeDate'
import {getNumberRangeType} from './typeNumber'

function countType(dataTypes, type) {
  return dataTypes.filter(t => t === type).length
}

function getValueByType(data, dataType) {
  // use first type in the list
  switch(dataType.list[0]) {
    case "number":
      return {
        // remove all non numeric or period, keep missing data
        values: data.map(d => d ? +d.replace(/[^0-9.\-]/g, "") : d)
      }
    case "date":
      return {
        values: getDateScaleValues(data, dataType.format, dataType.hasDay),
        hasDay: dataType.hasDay
      }
    case "string1":
      return {
        values: data,
        hasRepeat: dataType.hasRepeat
      }
    default:
      return {
        values: data
      }
  }
}

export default function(dataTable, show) {

  /* A. data filter on toggle */
  // row
  const dataRows = dataTable.flag.isHeader ? [true].concat(show.row.slice(0, -1)) : show.row
  // col
  const dataColsAndType = show.col
  .map((flagCol, i) => ({flagCol, i}))
  .filter(dc => dc.flagCol)
  .map(dc => ({
    type: dataTable.type[dc.i],
    cols: dataRows
      .map((flagRow, j) => ({flagRow, j}))
      .filter(dr => dr.flagRow)
      .map(dr => dataTable.cols[dc.i][dr.j])
    })
  )
  const dataType = dataColsAndType.map(d => d.type)
  const dataCols = dataColsAndType.map(d => d.cols)


  /* B. data summary */
  /* count and cols */
  const types = dataType.map(d => d.list[0])

  // for chart selection
  const count = {
    col: dataCols.length,
    row: dataTable.flag.isHeader ? dataCols[0].length-1 : dataCols[0].length,
    string1: countType(types, "string1"),
    string2: countType(types, "string2"),
    number:  countType(types, "number"),
    date:    countType(types, "date")
  }

  const cols = dataCols.map((col, i) => ({
      // content
      header: dataTable.flag.isHeader ? col.splice(0, 1)[0] : "",
      string: col,
      format: dataType[i].format,
      type: types[i],
      // values, hasDay, ...
      ...getValueByType(col, dataType[i])
  }))

  // data of 3 (4) types
  const numberData = cols.filter(col => col.type === "number")
  const dateData = count.date > 0 ? cols.find(col => col.type === "date") : []
  const string1Data = count.string1 > 0 ? cols.find(col => col.type === "string1") : []
  const string1Col = count.string1 > 0 ? string1Data.values : []
  const string2Col = count.string2 > 0 ? cols.find(col => col.type === "string2").values : []
  // TODO: think of string * have multi cols?

  // pre calc for string / label res of axis y
  const space = 12
  const elTest = document.querySelector(".js-test-y")
  const rowGroup = string1Col.length > 0 ? string1Col : dateData.string
  const string1Width = Math.max.apply(null, rowGroup.map(str => {
    elTest.textContent = str
    return elTest.offsetWidth
  })) + space
  const string1IsRes = string1Width > width/3

  /* aka. dataChart */
  // for render charts
  const chart = {
    rowCount: count.row,
    rowGroup,
    string1Col, string1Width, string1IsRes,
    string2Col,
    dateCol: dateData.values,
    dateHasDay: dateData.hasDay,
    dateFormat: dateData.format,
    numberCols: numberData.map(col => col.values),
    numberFormat: numberData.length === 1 ? numberData[0].format : null,
    keys: numberData.map(col => col.header ? col.header : "unknown title")
    // NOTE: in case header is null, also see getDataTable.js
    // TODO: keys turn into colGroup?
  }
  chart.numberRows = swapArray(chart.numberCols)
  chart.numbers = chart.numberCols.reduce((col1, col2) => col1.concat(col2))

  // for chart selection
  const value = {
    date_hasRepeat:    count.date > 0 ? uniqueArray(chart.dateCol).length !== count.row : false,
    string1_hasRepeat: count.string1 > 0 ? string1Data.hasRepeat : false,
    string1_format:    count.string1 > 0 ? string1Data.format : false, // TODO: code/name or bin
    numberH_format:    getDataType(chart.keys).types[0],
    number_rangeType:  getNumberRangeType(chart.numbers),
    number_hasNull:    chart.numbers.indexOf(null) > -1
  }


  const output = {count, value, chart}
  //console.log(output)
  return output
}
