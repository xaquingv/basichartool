import getDataTypeAnalysis from './detectDataType';

// meta keys
const META_KEYS = ["headline", "standfirst", "source", "type", "keys"];


/*
detect file format => CSV with , or \t or | OR JSON
=== validatation 1 ===
string => rows (based on the format)
rows => meta, body rows; ps. remove empty rows, wt about empty cols
=== validatation 2 ===
detect data type(s) of body rows
return meta, body, head (possible types)
*/


// Check if a row is meta data
function isMetaKeys(col) {
  return META_KEYS.filter(d => d === col).length === 1;
}

// Check if a row is empty, all cols have no value as content
function isNotEmpty(row) {
  return row.length !== row.filter(d => d === null).length;
}

function parseRow(dataTable, row) {
  let col0 = row[0].toLowerCase();
  // col0 is the key if this row is meta data

  // 1. trim and set empty entris to null
  row = row.map(d => {
    d = d.trim();
    return d!=="" ? d : null;
  });

  // 2. extract meta
  // 3. ignore empty lines
  switch (true) {
    case isMetaKeys(col0): dataTable.meta[col0] = row[1]; break;
    case isNotEmpty(row): dataTable.rows.push(row); break;
    default: /*console.log("empty row")*/;
  }
}


export default function(dataInput) {
  //console.log(dataInput);
  //if (dataInput==="") { return {}; }
  //else {

    // type
    let dataMatch = {
      tab:   dataInput.match(/\t/g),
      comma: dataInput.match(/\t/g),
    };
    let dataType = dataMatch.tab ? "tsv" : "csv";
    // and json?
    // console.log(dataType);

    // lines
    let dataLines = dataInput.split(/[\n|\r]/g);
    // console.log(dataLines);

    // parse to meta and row data
    let dataTable = {
      meta: {}, // [1]
      rows: [], // [1]
      cols: [], // [2]
      type: [], // [3] dataTable
      head: [], // [3] dataTable
      body: []  // [3] dataTable
    };


    /* 1. meta , rows */
    dataLines.forEach(row => {
      switch(dataType) {
        case "tsv": row = row.split("\t"); break;
        case "csv": row = row.split(",");  break;
        case "json": console.log("add a parser"); break;
        default: console.log("need a new type:", dataType);
      }
      parseRow(dataTable, row);
    });


    /* 2. cols */
    // init cols
    dataTable.cols = dataTable.rows[0].map(() => [] )
    dataTable.rows.forEach((row, i) =>
      row.forEach((val, j) =>
        dataTable.cols[j][i] = val
      )
    )

    // detect empty cols
    let emptyCols = []
    dataTable.cols.forEach((col, i) => {
      let empty = col.length === col.filter(val => val === null).length
      if (empty) {
        emptyCols.push(i)
        console.log("empty", i, col)
      }
    })
    // remove empty cols from both cols and rows data
    emptyCols.forEach((iEmpty, iAdjust) => dataTable.cols.splice(iEmpty-iAdjust, 1))
    dataTable.rows.forEach(row => emptyCols.forEach((iEmpty, iAdjust) => row.splice(iEmpty-iAdjust, 1)))


    /* 3. type, head, body */
    let bodyTypes = dataTable.cols.map((col) => {
      let output = getDataTypeAnalysis(col.slice(1), "body")
      let list = output.types
      let type = list[0]
      let format = (type !== "string") ? (output[type].format !== "" ? output[type].format : "") : ""
      return {list, format}
    })

    let headTypes = dataTable.cols.map((col) => {
      let head = col.slice(0, 1)[0] ? col.slice(0, 1) : [""]
      let output = getDataTypeAnalysis(head, "head")
      return output.types[0]
    })

    // detect if first row is label:
    // - head types doesn't match body types or
    // - all head types are strings
    let isFirstRowLabel =
    (headTypes.filter(headType => headType === "string").length === headTypes.length) ||
    (headTypes.filter((headType, i) => headType === bodyTypes[i].list[0]).length !== headTypes.length)
    //console.log(headTypes)

    dataTable.type = [{list:[""], format:""}].concat(bodyTypes)
    if (isFirstRowLabel) {
      dataTable.head = ["T"].concat(dataTable.rows.slice(0, 1)[0]);
      dataTable.body = dataTable.rows.slice(1)
      dataTable.rows = dataTable.rows.slice(1)
      dataTable.cols = dataTable.cols.map(col => col.slice(1))
    } else {
      dataTable.head = ["T"].concat(headTypes.map(() => "unknown title"));
      dataTable.body = dataTable.rows
    }


    console.log(dataTable)
    return dataTable
  //}
}


/*
//http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
function IsJsonString(str) {
try {
JSON.parse(str);
} catch (e) {
return false;
}
return true;
}*/
