import {d3} from '../lib/d3-lite'
import {uniqueArray, swapArray} from '../lib/array'
import getDataType from './detectDataType'
import {getDateScaleValues} from './typeDate'

function countType(dataTypes, type) {
  return dataTypes.filter(t => t === type).length
}

// TODO:
function getValueByType(data, dataType) {
  //console.log(data, type)
  let type = dataType.list[0]
  switch(type) {
    case "number":
      return {
        // remove all non numeric or period
        values: data.map(d => d ? +d.replace(/[^0-9.\-]/g, "") : d)
      }

    case "date":
      //console.log(dataType)
      return {
        values: getDateScaleValues(data, dataType.format, dataType.hasDay),
        hasDay: dataType.hasDay
      }

    //case "string1"
    //TODO: format checking - code/name of world, europe, uk , us .... or bins

    default:
      return {
        values: data
      }
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
    //console.log(col, dataType[i])
    return {
      // content
      header: dataTable.flag.isHeader ? col.splice(0, 1)[0] : "",
      string: col,
      format: dataType[i].format,
      type: dataType[i].list[0],
      // values, hasDay, ...
      ...getValueByType(col, dataType[i])
    }
  })


  const getStringFormat = () => {
    // TODO: parse and return code/name or bin
    return null
  }

  const dateData = count.date > 0 ? cols.find(col => col.type === "date")/*.values*/ : []
  const string1Col = count.string1 > 0 ? cols.find(col => col.type === "string1").values : [] // TODO: may have more than 1 col !?
  const string2Col = count.string2 > 0 ? cols.find(col => col.type === "string2").values : []
  const numberData = cols.filter(col => col.type === "number")
  //console.log(dateData)

  const chart = {
    rowCount: count.row,
    string1Col, string2Col,
    dateCol: dateData.values,
    dateHasDay: dateData.hasDay,
    dateFormat: dateData.format,
    numberCols: numberData.map(col => col.values),
    // NOTE: in case header is null, also see getDataTable.js
    keys: numberData.map(col => col.header ? col.header : "unknown title")
  }
  chart.numberRows = swapArray(chart.numberCols)
  chart.numbers = chart.numberCols.reduce((col1, col2) => col1.concat(col2))
  //console.log(dateData)

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

  const value = {
    date_hasRepeat:    count.date > 0 ? uniqueArray(chart.dateCol).length !== count.row : null,
    string1_hasRepeat: count.string1 > 0 ? uniqueArray(chart.string1Col).length !== count.row : null,
    string1_format:    getStringFormat(),
    numberH_format:    getDataType(chart.keys).types[0],
    number_rangeType:  getNumberRangeType(),
    number_hasNull:    chart.numbers.indexOf(null) > -1
  }

  let output = {/*cols,*/ count, value, chart}
  //console.log(output)
  return output
}
