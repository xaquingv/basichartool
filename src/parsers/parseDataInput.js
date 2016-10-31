import getDataTable from '../parsers/getDataTable';
import {swapeArray} from '../lib/array'

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

function parseRow(dataTableRaw, row) {
  let col0 = row[0].toLowerCase();
  // col0 is the key if this row is meta data

  // 1. trim and set empty entris to null
  row = row.map(d => {
    d = d.trim();
    return (d!=="" && d!=="..") ? d : null;
  });

  // 2. extract meta
  // 3. ignore empty lines
  switch (true) {
    case isMetaKeys(col0): dataTableRaw.meta[col0] = row[1]; break;
    case isNotEmpty(row): dataTableRaw.rows.push(row); break;
    default: /*console.log("empty row")*/;
  }
}

export default function(dataInput) {
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

    let dataTableRaw = {
      meta: {}, // [1]
      rows: [], // [1]
      cols: [], // [2]
    };


    /* 1. meta , rows */
    dataLines.forEach(row => {
      switch(dataType) {
        case "tsv": row = row.split("\t"); break;
        case "csv": row = row.split(",");  break;
        case "json": console.log("add a parser"); break;
        default: console.log("need a new type:", dataType);
      }
      parseRow(dataTableRaw, row);
    });


    /* 2. cols */
    // init cols
    dataTableRaw.cols = swapeArray(dataTableRaw.rows)

    // detect empty cols
    let emptyCols = []
    dataTableRaw.cols.forEach((col, i) => {
      let empty = col.length === col.filter(val => val === null).length
      if (empty) {
        emptyCols.push(i)
        console.log("empty", i, col)
      }
    })
    // remove empty cols from both cols and rows data
    emptyCols.forEach((iEmpty, iAdjust) => dataTableRaw.cols.splice(iEmpty-iAdjust, 1))
    dataTableRaw.rows.forEach(row => emptyCols.forEach((iEmpty, iAdjust) => row.splice(iEmpty-iAdjust, 1)))


    /* 3. dataTableDraw: type, head, body, flag */
    // including dataTableRaw and dataTableDraw
    const dataTable = getDataTable(dataTableRaw)
    console.log(dataTable)
    return dataTable
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
