import getDataTable from '../data/parseDataTableRaw'
import {swapArray} from '../lib/array'

// meta keys
const META_KEYS = ["headline", "standfirst", "source", "unit", "note", "page", "#"]

/*
detect file format => CSV with , or \t or | OR JSON
=== validatation 1 ===
string => (line) rows (based on the format)
rows => meta and (data) rows
rows => cols; ps. remove empty rows and cols
=== validatation 2 ===
detect
- if data has headers, and
- data type(s) of all body cols
=> flag, head, type, body
*/

export default function(dataInput) {
    /* dataInput (raw input string to lines) */
    // detect file type
    const fileType = dataInput.match(/\t/g) ? "tsv" : "csv"
    // transfer string => lines
    const dataLines = dataInput.split(/\n/g)
    // or dataLines = dataInput.split(/[\n|\r]/g);
    // ref: http://stackoverflow.com/questions/10059142/reading-r-carriage-return-vs-n-newline-from-console-with-getc
    // console.log(dataLines);


    /* dataTableRaw */
    let dataTableRaw = {
      meta: {}, // [1]
      rows: [], // [1]
      cols: [], // [2]
    }

    /* 1. meta , rows */
    // parse from data input
    // TODO: csv with comma in quotes ("hi, sth. like this") is not parsed and json?
    dataLines.forEach(row => {
      switch(fileType) {
        case "tsv": row = row.split("\t"); break
        case "csv": row = row.split(",");  break
        case "json": console.log("add a parser"); break
        default: console.log("need a new file type:", fileType)
      }
      parseRow(dataTableRaw, row)
    });


    /* 2. cols */
    // init cols and clean both cols and rows
    dataTableRaw.cols = swapArray(dataTableRaw.rows)

    // detect empty cols
    const emptyCols = dataTableRaw.cols
    .map((col, idx) => ({col, idx}))
    .filter(d => d.col.every(val => val === null))
    .map(d => d.idx)
    // remove empty cols from both cols and rows data
    emptyCols.forEach((iEmpty, iAdjust) => dataTableRaw.cols.splice(iEmpty-iAdjust, 1))
    dataTableRaw.rows.forEach(row => emptyCols.forEach((iEmpty, iAdjust) => row.splice(iEmpty-iAdjust, 1)))


    /* 3. flag, head, type, body (of dataTableDraw) */
    // add properties from parseDataTableRaw.js including dataTableRaw and dataTableDraw
    const dataTable = getDataTable(dataTableRaw)
    
    /* debug zone:
    console.log("input -> table")
    // in this file
    console.log("dataTableRaw: parse from dataInput (this file)")
    console.log(dataTableRaw)
    // in parseDataTableRaw.js
    console.log("dataTableDraw: parse for table view and transformations (via parseDataTableRaw.js)")
    console.log(dataTableDraw)
    // combine
    console.log("dataTable:")
    console.log(dataTable)
    */
    return dataTable
}

// Check if a row is meta data
function isMetaKeys(col) {
  return META_KEYS.some(d => d === col)
}
// Check if a row is empty, all cols have no value as content
function isNotEmpty(row) {
  return !row.every(d => d === null)
}

function parseRow(dataTableRaw, row) {
  let col0 = row[0].toLowerCase().trim()

  // 1. trim and set empty entris to null
  row = row.map(d => {
    d = d.trim()
    return (d!=="" && d!==".." && d!=="-") ? d : null
  });

  // 2. extract meta
  // 3. ignore empty lines
  switch (true) {
    // col0 is the key if this row is meta data
    case isMetaKeys(col0): dataTableRaw.meta[col0] = row[1]; break
    case isNotEmpty(row): dataTableRaw.rows.push(row); break
    default: // console.log("empty row")
  }
}

// TODO: parse JSON
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
