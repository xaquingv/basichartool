import {d3} from '../lib/d3-lite'


/*
number data type:
- numbers only
- numbers with formats such as
- , : follow uk/us standard ex. 1,000.00, smaller than 1000 won't see it
- % : on the right side of the digits, for all
- currency : on the left, for all
*/
const regexNumFormats = /,|%|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;
const regexCurrencies = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;
//const regexNotNumbers = /[^0-9.\-]/g


/* 1. input format */
/* detect numbers and format types if any */
export function getNumberAnalysis(data) {
  //console.log("data:", data)

  let format = data[0].match(regexNumFormats);
  let values = data
  .map(d => d.replace(regexNumFormats, ""))  // remove formats
  .filter(d => !isNaN(d !== "" ? d : NaN))      // if is number
  .map(d => parseFloat(d))                      // str to num data type

  let isNumber = values.length === data.length;
  format = (isNumber && format) ? format[0] : null
  // console.log(format)
  // could be unit only but no number(s), ex. %
  // support currency sign "before" numbers

  return {
    format,
  //values,
    valid: isNumber
  }
}

/* assign a number rang */
export function getNumberRangeType(numbers) {
  const range = d3.extent(numbers)
  const min = range[0]
  const max = range[1]

  switch (true) {
    case min < 0 && max > 0: return  0  // both positive and negative values
    case min >= 0:           return  1  // all positive values
    case max <= 0:           return -1  // all negative values
    default: console.warn("rangeType unknown!!!")
  }
}


/* 2. number with format */
// append unit/format to the first label text
export function appendFormatToNum(txt0, unit, numFormat, is100, isBarBased, isX) {
  const format = (numFormat !== "," ? numFormat : null) || unit
  const isCurrencySign = format ? format.match(regexCurrencies) !== null : false
  const isCurrencyUnit = unit ? ["tn", "bn", "m"].some(u => u === unit.toLowerCase()) : false
  const isOtherUnitTxt = unit ? true : false

  // NOTE: case order is important!
  switch(true) {
    case (is100 || format === "%"):
      return txt0 + "%"
    case isX && !isBarBased:
      // x axis of line/plot, no append
      return txt0
    case (isCurrencySign):
      return format + txt0 + (isCurrencyUnit ? unit.toLowerCase() : "")
    case (isCurrencyUnit):
      return txt0 + unit.toLowerCase()
    case (isOtherUnitTxt):
      return txt0 + " " + unit
    default:
      //console.warn("any unit for formats?", numFormat, unit, format)
      return txt0
  }
}


/* 3. number to label text */
export function numToTxt(num) {
    // filter
    let txt = num.toString();
    if (txt[txt.length-1] !== "0") {
      return num.toLocaleString();//numFormat(num);
    }

    let abs = Math.abs(num),
        pow = Math.floor(Math.log10(abs)),
        div = (d) => Math.pow(10, d),
        sign = Math.sign(num) === -1 ? "-" : ""; // negative num

    switch (true) {
        case pow >= 12: txt = abs/div(12) + "tn"; break;
        case pow >=  9: txt = abs/div(9)  + "bn"; break;
        case pow >=  6: txt = abs/div(6)  + "m";  break;
        //case pow >=  5: txt = abs*100/div(5) + "k";  break;
        default: txt = abs//numFormat(abs)
    }
    return sign + txt.toLocaleString();//txt;
}
// to local string
/*function numFormat(num) {
    let str = num.toString().split("."), // float num
        txt = str[0], // num without negative and float
        dec = str[1] ? "." + str[1] : "",
        len = txt.length;
    return len > 3 ?
        //txt.substring(0, len-3) + "," + txt.substring(len-3) + dec :
        txt.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + dec :
        txt + dec;
}*/
