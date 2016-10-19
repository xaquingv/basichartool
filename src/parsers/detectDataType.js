// string
// number: 1,000, 100m, %, currency
// date: ...
// https://en.wikipedia.org/wiki/Decimal_mark
// https://en.wikipedia.org/wiki/Date_format_by_country
import {d3} from '../lib/d3-lite.js'

//const regex = /-?[$¢£¤¥֏؋৲৳৻૱௹฿៛\u20a0-\u20bd\ua838\ufdfc\ufe69\uff04\uffe0\uffe1\uffe5\uffe6]?\d{1,3}(,\d{3}|\d)*(\.\d+)?%?/g;
const regexNumberFormats = /,|%|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;
// the third part equaivalent to /\p{Sc}/
//const regexDateSeparators = /\/|-|\.|\s/g
const dateFormatExtension = ["%d/%m/%Y", "%d/%m/%y", "%Y%m%d", "%B", "%b", "%H:%M:%S"]
const dateFormatHijack = ["%b-%y"]

function testDataDateClean(dataClean, formats) {
  let dateFormat = formats.filter(f => {
    let parser = d3.timeParse(f)
    return parser(dataClean[0])
  })[0]

  let dateParser = d3.timeParse(dateFormat);

  let dataDateClean = dateParser ? dataClean.filter(data => dateParser(data)) : []

  return {
    dateFormat, dateParser, dataDateClean,
    isDate: dataDateClean.length === dataClean.length
  }
}


export default function(dataArr = "", tablePart) {
  //console.log(dataArr)
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


  /* number format */
  //TODO: think if it's enough to use only the first row
  //console.log(dataClean)
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
  //console.log(dataNumberClean)

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


  /* date format */
  let charCount = dataClean[0].match(/\w\s|\/|-|\s|:/g) ? dataClean[0].match(/\D/g).length : 0
  let numberCount = dataClean[0].match(/\d/g) ? dataClean[0].match(/\d/g).length : 0

  // filter cols with number only
  let numberMightBeDate = true
  if (numberCount>0 && charCount===0) {
    let dataLen = dataClean.length

    let isSameNumberCount = dataClean.filter(d => d.match(/\d/g).length === numberCount).length === dataLen
    let isInteger = dataClean.filter(d => Number.isInteger(parseFloat(d))).length === dataLen

    let thisYear = new Date().getFullYear()
    let isAllYearsLargerThanThisYear =
      (numberCount === 4) &&
      (dataClean.filter(d => parseInt(d) > thisYear).length === dataLen)

    numberMightBeDate =
      isSameNumberCount &&
      (numberCount === 4 || numberCount === 8) &&
      // ex. 1996, 20161008
      isInteger &&
      !isAllYearsLargerThanThisYear

    //console.log("num count", numberCount, isSameNumberCount)
    //console.log("chart int", charCount === 0 && isInteger)
  }

  if (!numberFormat && numberMightBeDate) {
    let isDate
    let dataDateClean
    let dateParser
    let dateFormat

    // first attemp - hijack
    ({dataDateClean, dateParser, dateFormat, isDate} = testDataDateClean(dataClean, dateFormatHijack))

    // second attemp - js default date
    if (!isDate) {
      dataDateClean = dataClean.filter(data =>
        new Date(data).getTime() > 0
      )
      isDate = dataDateClean.length === dataClean.length
    }

    // third attemp - custom
    if (!isDate) {
      ({dataDateClean, dateParser, dateFormat, isDate} = testDataDateClean(dataClean, dateFormatExtension))
    }

    if (isDate) {
      let dates = dataDateClean.map(str => dateFormat ? dateParser(str) : new Date(str))

      data.types.push("date")
      data.date = {
        values: dates,
        format: dateFormat ? dateFormat : ""
      }
    }
  }


  /* string format */
  if (!numberFormat && data.types.join() !== "number") { data.types.push("string")};


  //console.log(data.types.sort())
  //console.log(data)
  data.types.sort()
  return data
}
