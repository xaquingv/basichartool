import {d3} from '../lib/d3-lite.js'

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
      return data.map(d => d ? parseFloat(d.replace(/,|%/g, "")) : d)

    case "date":
      let isFormat = dataType.format
      let parser = d3.timeParse(dataType.format)
      /*
      let dataLen = data.length
      let day   = data.filter(date => date.getDate()  === 1).length !== dataLen
      let month = data.filter(date => date.getMonth() === 0).length !== dataLen
      let year  = data.filter(date => date.getYear()  === 0).length !== dataLen
      //console.log("units D:", hasDUnit, "M", hasMUnit, "Y", hasYUnit)
      //isUnit: {year, month, day}
      */
      return data.map(date => isFormat ? parser(date) : new Date(date))

    default:
      return data
  }
}

export default function(dataTable, show) {
  //console.log(show)
  //console.log(dataTable)

  /* filter on toggle */
  let dataType = [];
  let dataCols = [];
  show.col.forEach((flagCol, i) => {
    if (flagCol) {
      // data values
      let col = []
      show.row.forEach((flagRow, j) => {
        if (flagRow) {
          col.push(dataTable.cols[i][j])
      }})
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
    string: countType(types, "string"),
    number: countType(types, "number"),
    date: countType(types, "date")
  }
  //console.log(types)

  /* summarise col data */
  // TODO: from here ...
  const cols = dataCols.map((col, i) => ({
    // content
    header: dataTable.flag.isHeader ? col.splice(0, 1)[0] : "",
    string: col,
    values: getValueByType(col, dataType[i]),
    // properties in general
    //hasNullValue:
    //hasRepeatValue:
    type: dataType[i].list[0],
    // properties on type
    // color: ...
    /*format: dataType[i].format,
    domain: //range
    isNegative:
    baseUnit:
    hasDay:*/
  }))

  let output = {count, cols}
  console.log(output)
  return output
}
