// string
// number: 1,000, 100m, %, currency
// date: ...
// https://en.wikipedia.org/wiki/Decimal_mark
// https://en.wikipedia.org/wiki/Date_format_by_country
import {d3} from '../lib/d3-lite.js'

//const regexDateSeparators = /\/|-|\.|\s/g
// the third part equaivalent to /\p{Sc}/
const regexNumberFormats = /,|%|[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g;

const dateFormatExtension = ["%d/%m/%Y", "%d/%m/%y", "%Y%m%d", "%B", "%b", "%H:%M:%S"]
const dateFormatHijack = ["%Y", "%b-%y", "%b %y", "%Y-%y", "%Y/%y"]

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
  //console.log("check1:", dataClean)

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
  //console.log("checkN:", dataNumberClean)

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
  //let charCount = dataClean[0].match(/\w\s|\/|\s|:/g) ? dataClean[0].match(/\D/g).length : 0
  let numberCount = dataClean[0].match(/\d/g) ? dataClean[0].match(/\d/g).length : 0

  // filter cols with number only
  let numberMightBeDate = true
  if (isNumber && !numberFormat/*numberCount>0 && charCount===0*/) {
    let dataLen = dataClean.length

    let isSameNumberCount = dataClean.filter(d => d.match(/\d/g).length === numberCount).length === dataLen
    let isInteger = dataClean.filter(d => Number.isInteger(+d) > 0).length === dataLen
    //console.log("checkD:", dataClean)
    //console.log("integer", isInteger)

    let thisYear = new Date().getFullYear()
    let isAllYearsLargerThanThisYear =
      (numberCount === 4) &&
      (dataClean.filter(d => parseInt(d, 10) > thisYear).length === dataLen)

    numberMightBeDate =
      isSameNumberCount &&
      (numberCount === 4 || numberCount === 8) &&
      // ex. 1996, 20161008
      isInteger &&
      !isAllYearsLargerThanThisYear

    //console.log(dataClean)
    //console.log(isSameNumberCount)
    //console.log((numberCount === 4 || numberCount === 8))
    //console.log(isInteger)
    //console.log(!isAllYearsLargerThanThisYear)
  }

  //console.log(!numberFormat && numberMightBeDate)
  if (/*!numberFormat && */numberMightBeDate) {
    let isDate
    let dataDateClean
    let dateParser
    let dateFormat


    // first attemp - hijack
    ({dataDateClean, dateParser, dateFormat, isDate} = testDataDateClean(dataClean, dateFormatHijack))

    // second attemp - js default date
    if (!isDate) {
      dataDateClean = dataClean.filter(data => {
        //console.log(data, new Date(data))
        return !isNaN(new Date(data).getTime())
      })

      isDate = dataDateClean.length === dataClean.length
      //console.log(dataDateClean.length, dataClean.length, isDate)
    }

    // third attemp - custom
    if (!isDate) {
      ({dataDateClean, dateParser, dateFormat, isDate} = testDataDateClean(dataClean, dateFormatExtension))
    }
    //console.log(dataClean)
    //console.log("date", isDate)
    if (isDate) {
      let dates = dataDateClean.map(str => dateFormat ? dateParser(str) : new Date(str))

      data.types.push("date")
      data.date = {
        //values: dates,
        format: dateFormat ? dateFormat : "",
        hasDay: dates.filter(date => date.getDate() === 1).length !== dates.length
        // TODO: how about HMS
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
