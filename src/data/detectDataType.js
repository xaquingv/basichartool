// string
// number: 1,000, 100m, %, currency
// date: ...
// https://en.wikipedia.org/wiki/Decimal_mark
// https://en.wikipedia.org/wiki/Date_format_by_country
import {uniqueArray} from '../lib/array'
import {getDateInputFormat} from './typeDate'

//const regexDateSeparators = /\/|-|\.|\s/g
// the third part equaivalent to /\p{Sc}/
const regexNumberFormats = /,|%|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;


export default function(dataArr = "", tablePart) {
  //console.log(dataArr, tablePart)
  let data = { types:[] };

  /* missing data */
  let dataClean;
  switch (tablePart) {
    case "body":
      dataClean = dataArr.filter(data => data)
      //let isNull = dataClean.length < dataArr.length
      //if (isNull) console.log("missing data")
      break;
    case "head":
    default:
      dataClean = dataArr
      break;
  }
  //console.log("check1:", dataClean)

  /* number format */
  //TODO: think if it's enough to use only the first row
  //console.log(dataClean, dataArr)
  let numberFormat = dataClean[0].match(regexNumberFormats);
  let dataNumberClean = dataClean
  .map(data =>
    // remove formats for testing
    data.replace(regexNumberFormats, "")
  )
  .filter(data =>
    // testing number type
    //!isNaN(parseFloat(n)) && isFinite(n)
    !isNaN(data !== "" ? data : NaN)
  ).map(data =>
    parseFloat(data)
  )

  let isNumber = dataNumberClean.length === dataClean.length;
  // case of unit but not number(s), ex. %
  numberFormat = isNumber ? numberFormat : false

  // case of currency
  // default currency format includes comma format
  if (numberFormat ? numberFormat.length > 1 : false) {
    numberFormat.splice(numberFormat.indexOf(","), 1)
  }

  if (isNumber) {
    data.types.push("number")
    data.number = {
      values: dataNumberClean,
      format: numberFormat ? numberFormat[0] : ""
    }
    //TODO: sync dataNumber format
  }
  //console.log("numb:", dataNumberClean, numberFormat, isNumber)


  /* date format */
  const dataDate = getDateInputFormat(dataClean)
  if (dataDate.format) {
    data.types.push("date")
    data.date = dataDate
  }


  /* string format */
  if (!numberFormat && data.types.join() !== "number") {
    let uniqueLen = uniqueArray(dataClean).length
    let hasRepeat = dataClean.length !== uniqueLen

    if (hasRepeat && uniqueLen > 1 && uniqueLen < 11) {
      data.types.push("string2")
    } else {
      data.types.push("string1")
      data.string = {
        hasRepeat: hasRepeat,
        //format:
      }
    }
  };


  data.types.sort()
  //console.log("=>", data.types[0])
  return data
}
