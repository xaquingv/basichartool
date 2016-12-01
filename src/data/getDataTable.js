import getDataTypeAnalysis from './detectDataType';

export default function(dataTableRaw) {
  //console.log(dataTableRaw)
  const {cols, rows} = dataTableRaw

  /* head and body types */
  let bodyTypes = cols.map((col) => {
    let output = getDataTypeAnalysis(col.slice(1), "body")
    //console.log(output)

    let list = output.types
    let type = list[0]
    let format = (type !== "string") ? output[type] : {format:""}

    return {list, ...format}
  })

  let headTypes = cols.map((col) => {
    let head = col.slice(0, 1)[0] ? col.slice(0, 1) : [""]
    let output = getDataTypeAnalysis(head, "head")
    return output.types[0]
  })

  /* 3. dataTableDraw: type, head, body, flag */
  let dataTableDraw = { flag:{}};

  // detect if first row is label:
  // - head types doesn't match body types or
  // - all head types are strings
  dataTableDraw.flag = { isHeader:
    (headTypes.filter(headType => headType === "string").length === headTypes.length) ||
    (headTypes.filter((headType, i) => headType === bodyTypes[i].list[0]).length !== headTypes.length)
  }
  //console.log(headTypes)

  dataTableDraw.type = bodyTypes
  if (dataTableDraw.flag.isHeader) {
    dataTableDraw.head = rows.slice(0, 1)[0]
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
