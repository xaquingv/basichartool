import {uniqueArray, swapArray} from '../lib/array'
import getDataType from './detectDataType'
import {getString1DataRes}  from './calcAxisYText'
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
  const numberData  = cols.filter(col => col.type === "number")
  const numberCols  = numberData.map(col => col.values)
  const numbers     = numberCols.reduce((col1, col2) => col1.concat(col2))
  const dateData    = count.date > 0 ? cols.find(col => col.type === "date") : []
  const string1Data = count.string1 > 0 ? cols.find(col => col.type === "string1") : []
  const string1Col  = count.string1 > 0 ? string1Data.values : []
  const string2Col  = count.string2 > 0 ? cols.find(col => col.type === "string2").values : []
  const rowGroup    = count.string1 > 0 ? string1Col : (dateData.string : [])
  // TODO: think of string * have multi cols?


  /* aka. dataChart */
  // for render charts

  const chart = {
    // count
    rowGroup,
    rowCount:     count.row,
    // string and
    // pre calc for string / label res of axis y
    string1Col, string2Col,
    ...getString1DataRes(rowGroup),
    // date
    dateCol:      dateData.values,
    dateString:   dateData.string,
    dateHasDay:   dateData.hasDay,
    dateFormat:   dateData.format,
    // number
    numberCols, numbers,
    numberRows:   swapArray(numberCols),
    numbersButC1: numbers.slice(-(numbers.length-count.row)),
    numberFormat: count.number === 1 ? numberData[0].format : null,
    numberOnly:   count.date === 0 && count.string1 === 0,
    // key (legned)
    // NOTE: in case header is null, also see getDataTable.js
    // TODO: keys turn into colGroup?
    keys:         numberData.map(col => col.header ? col.header : "unknown title")
  }

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
