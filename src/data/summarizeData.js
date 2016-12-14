import {d3} from '../lib/d3-lite'
import {uniqueArray, swapArray} from '../lib/array'
import getDataType from './detectDataType'

function countType(dataTypes, type) {
  return dataTypes.filter(t => t === type).length
}

// TODO:
function getValueByType(data, dataType) {
  //console.log(data, type)
  let type = dataType.list[0]
  switch(type) {
    case "number":
    //console.log("format:", dataType.format)
    // remove all non numeric or period
    return {values: data.map(d => d ? +d.replace(/[^0-9.\-]/g, "") : d)}

    case "date":
    let format = dataType.format
    let parser = d3.timeParse(dataType.format)
    let hasDay = dataType.hasDay

    let values
    let getDates = () => data.map(date => format ? parser(date) : new Date(date))

    switch (true) {
      case (format === "%Y"):
        values = data.map(date => +date)
        break
      case (format === "%Y-%y" || format === "%Y/%y"):
        values = data.map(date => +date.slice(0, 4))
        break
      case !hasDay:
        values = getDates().map(date => date.getFullYear() + date.getMonth()/12)
        break
      default:
        values = getDates()
    }
    return {values, hasDay}

    //case "string1"
    //TODO: format checking - code/name of world, europe, uk , us .... or bins

    default:
    return {values: data}
  }
}

export default function(dataTable, show) {
  //console.log(show)
  //console.log(dataTable)

  /* filter on toggle */
  let dataType = [];
  let dataCols = [];

  let showRowAdjust = dataTable.flag.isHeader ? [true].concat(show.row.slice(0, -1)) : show.row
  //console.log(show.row, showRowAdjust)

  show.col.forEach((flagCol, i) => {
    if (flagCol) {
      // data values
      let col = []
      showRowAdjust.forEach((flagRow, j) => {
        if (flagRow) {
          col.push(dataTable.cols[i][j])
        } else {
          // remove row
          //console.log("remove:", j, dataTable.rows[j])
        }
      })
      dataCols.push(col)

      // data types
      //let type = dataTable.type[i]
      dataType.push(dataTable.type[i])
    }
  })
  //console.log(dataCols)
  //console.log(dataType)

  /* count */
  const types = dataType.map(d => d.list[0])
  const count = {
    col: dataCols.length,
    row: dataTable.flag.isHeader ? dataCols[0].length-1 : dataCols[0].length,
    string1: countType(types, "string1"),
    string2: countType(types, "string2"),
    number: countType(types, "number"),
    date: countType(types, "date")
  }
  //console.log(types)

  /* summarise col data */
  // TODO: from here ...

  const cols = dataCols.map((col, i) => {
    //console.log(uniqueArray(col))
    return {
      // content
      header: dataTable.flag.isHeader ? col.splice(0, 1)[0] : "",
      string: col,
      ...getValueByType(col, dataType[i]), //values
      type: dataType[i].list[0],
      format: dataType[i].format
    }
  })


  const getStringFormat = () => {
    // TODO: parse and return code/name or bin
    return null
  }

  const dateData = count.date > 0 ? cols.find(col => col.type === "date")/*.values*/ : []
  const numberData = cols.filter(col => col.type === "number")
  const string1Col = count.string1 > 0 ? cols.find(col => col.type === "string1").values : [] // TODO: may have more than 1 col !?
  const string2Col = count.string2 > 0 ? cols.find(col => col.type === "string2").values : []

  const chart = {
    string1Col, string2Col,
    dateCol: dateData.values,
    dateHasDay: dateData.hasDay,
    numberCols: numberData.map(col => col.values),
    rowCount: count.row
  }
  //console.log(chart.numberCols)
  chart.numberRows = swapArray(chart.numberCols)
  chart.numbers = chart.numberCols.reduce((col1, col2) => col1.concat(col2))
  //console.log(data)

  const getNumberRangeType = () => {
    const range = d3.extent(chart.numbers)
    const min = range[0]
    const max = range[1]

    switch (true) {
      case min < 0 && max > 0:
        return 0
      // all positives
      case min >= 0 && max > 0:
        return 1
      // all negatives
      case (min < 0 && max <= 0):
        return -1
      default:
      console.err("rangeType unknown!!!")

    }
  }

  // NOTE: in case header is null, also see getDataTable.js
  const numberHeaders = numberData.map(col => col.header ? col.header : "unknown title")
  const value = {
    date_hasRepeat:    count.date > 0 ? uniqueArray(chart.dateCol).length !== count.row : null,
    string1_hasRepeat: count.string1 > 0 ? uniqueArray(chart.string1Col).length !== count.row : null,
    string1_format:    getStringFormat(),
    numberH_format:    getDataType(numberHeaders).types[0],
    number_rangeType:  getNumberRangeType(),
    number_hasNull:    chart.numbers.indexOf(null) > -1
  }
  //console.log(chart.numbers, value.number_hasNull)

  let output = {cols, count, value, chart}
  //console.log(output)
  return output
}
