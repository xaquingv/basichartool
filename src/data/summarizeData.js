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
        values: data.map(d => d ? +d.replace(/[^-+0-9.]/g, "") : d)
        //values: data.map(d => +d)
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
  console.log(dataTable)
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
    row: dataCols.length !== 0 ? (dataTable.flag.isHeader ? dataCols[0].length-1 : dataCols[0].length) : 0,
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
  const numbers     = count.number !== 0 ? numberCols.reduce((col1, col2) => col1.concat(col2)) : []
  const dateData    = count.date > 0 ? cols.find(col => col.type === "date") : []
  const string1Data = count.string1 > 0 ? cols.filter(col => col.type === "string1") : []
  const string1Col  = count.string1 > 0 ? string1Data[0].values : []
  const string3Col  = count.string1 > 1 ? string1Data[1].values : null
  const string2Col  = count.string2 > 0 ? cols.find(col => col.type === "string2").values : []
  const rowGroup    = count.string1 > 0 ? string1Col : (dateData.string || [])
  // NOTE: think of string * have multi cols?
  
  // data for sumstats
  const col1stData = cols[0]
  // const col1stDataHeader = col1stData[0]
  // const col1stDataList = col1stData//.slice(1) 
  // const col1stDataType = dataType[0].list[0]
  // //***console.log(col1stData)
  // //***console.log("type:", col1stData.type)
  // //***console.log("header:", col1stData.header)
  // //***console.log("string:", col1stData.string)

  /* aka. dataChart */
  // for render charts

  const chart = {
    // count
    rowGroup,
    rowCount:     count.row,
    colCount:     count.col,
    // string and
    // pre calc for string / label res of axis y
    string1Col, string2Col, string3Col,
    ...getString1DataRes(rowGroup),
    // date
    dateCol:      dateData.values,
    dateString:   dateData.string,
    dateHasDay:   dateData.hasDay,
    dateFormat:   dateData.format,
    // number
    numberCols, numbers,
    numberRows:   count.number !== 0 ? swapArray(numberCols) : [],
    numbersButCol1: numbers.slice(-(numbers.length-count.row)),
    numberFormat: count.number === 1 ? numberData[0].format : null,
    numberOnly:   count.date === 0 && count.string1 === 0,
    // key (legned)
    // NOTE: in case header is null, also see getDataTable.js
    // TODO: keys turn into colGroup?
    keys:         numberData.map(col => col.header ? col.header : "unknown title"),
    // sumstats
    col1Type: col1stData.type,
    col1Header: col1stData.header,
    col1ValuesToStrings: col1stData.string
  }

  // for chart selection
  const value = {
    date_hasRepeat:    count.date > 0 ? uniqueArray(chart.dateCol).length !== count.row : false,
    string1_hasRepeat: count.string1 > 0 ? string1Data[0].hasRepeat : false,
    string1_format:    count.string1 > 0 ? string1Data[0].format : false, // TODO: code/name or bin
    numberH_format:    count.number !== 0 ? getDataType(chart.keys).types[0] : false,
    number_rangeType:  getNumberRangeType(chart.numbers),
    number_hasNull:    chart.numbers.indexOf(null) > -1
  }


  const output = {count, value, chart}
  console.log(output)
  return output
}
