
function countType(dataTypes, type) {
    return dataTypes.filter(t => t === type).length
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
    row: dataCols[0].length,
    string: countType(types, "string"),
    number: countType(types, "number"),
    date: countType(types, "date")
  }
  //console.log(types)

  /* summarise data */
  // TODO: from here ...
  const data = {}

  //console.log(count)
  return {count, data}
}
