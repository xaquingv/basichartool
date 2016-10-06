/*
  number data type
  - numbers only
  - numbers with formats such as
    - , : follow uk standard ex. 1,000.00, smaller than 1000 won't see it
    - % : on the right side of the digits, for all
    - currency : on the left, for all
*/
export default function(dataClean) {
  /* number format */
  //TODO: think if it's enough to use only the first row
  let numberFormat = dataClean[0].match(regexNumberFormats);
  let dataNumberClean = dataClean
  .map(data =>
    // remove formats for testing
    data.replace(regexNumberFormats, "")
  )
  .filter(data =>
    // testing number type
    //!isNaN(parseFloat(n)) && isFinite(n)
    !isNaN(data)
  ).map(data =>
    parseFloat(data)
  )

  let isNumber = dataNumberClean.length === dataClean.length;

  // case of currency
  // default currency format includes comma format
  if (numberFormat ? numberFormat.length > 1 : false) {
    numberFormat.splice(numberFormat.indexOf(","), 1)
  }
  if (isNumber) {
    types.push("number");
    console.log("num", numberFormat ? "/ "+numberFormat[0] : "")
    console.log(dataNumberClean)
    //TODO: sync dataNumber format
  }
}
