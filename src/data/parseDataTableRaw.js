import getDataTypeAnalysis from './detectDataType';

export default function(dataTableRaw) {
  /* 1. dataTableRaw */
  const {cols, rows} = dataTableRaw


  /* 2. dataTableDraw
  /* a. flag (if first row is header),
  /* b. head(er),
  /* c. (data) type (of each body col),
  /* d. body (col-based) */
  let dataTableDraw = { flag: {} }

  // if first row is header:
  // [c] detect data type of each col data
  let bodyTypes = cols.map((col) => {
    let output = getDataTypeAnalysis(col.slice(1), "body")
    //console.log(output)

    let list = output.types
    let type = list[0]
    let format = output[type]
    //(type.indexOf("string") === -1) ? output[type] : {format:""}

    return {list, ...format}
  })

  // detect data type of first row in each col
  let headTypes = cols.map((col) => {
    let head = col.slice(0, 1)[0] ? col.slice(0, 1) : [""]
    let output = getDataTypeAnalysis(head, "head")
    return output.types[0]
  })

  // [a] conditions:
  // - head types doesn't match body types or
  // - all head types are strings
  dataTableDraw.flag = { isHeader:
    (headTypes.filter(headType => headType.indexOf("string") !== -1).length === headTypes.length) ||
    (headTypes.filter((headType, i) => headType === bodyTypes[i].list[0]).length !== headTypes.length)
  }

  // get [b] and [d] depends on header flag
  dataTableDraw.type = bodyTypes
  if (dataTableDraw.flag.isHeader) {
    // TODO: double check headers
    const headers = rows.slice(0, 1)[0].map(header => header ? header : "unknown title")
    dataTableDraw.head = headers//rows.slice(0, 1)[0]
    dataTableDraw.body = rows.slice(1)
  } else {
    dataTableDraw.head = headTypes.map(() => "unknown title")
    dataTableDraw.body = rows
  }

  return {
    ...dataTableRaw,
    ...dataTableDraw
  }
}
