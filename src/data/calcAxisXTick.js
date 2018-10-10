import {d3} from '../lib/d3-lite'
import {numToTxt} from './typeNumber'
import {getDateTextFormat, dateNumToTxt} from './typeDate'


let isMarked = false
const markSymbol = "*"


// TODO: refactory and add case description to this switch
export function getTickSteps(id, isBarBased, dataX, format, rowCount, axisX) {
  console.log(dataX);
  switch (true) {

    /* bars */
    case ["brokenBar100"].includes(id):
      //console.log("broken bars", "(50)")
      return [50]

    case ["bar100", "barGroupStack100"].includes(id):
      //console.log("100% bars", "(0 - 100%)")
      return [0, 25, 50, 75, 100]

    // most bar cases
    case isBarBased:
      //console.log("bars", "(linear)")
      return axisX.ticks(5)

    /* line/plot */
    case ["lineDiscrete"].includes(id) && rowCount < 7:
      //console.log("lineDiscrete", "(row < 7)")
      return dataX.map((d, i) => i)

    case rowCount < 7:
      //console.log("line/plot but discrete", "(row < 7)")
      return dataX

    // ex. plotScatter, long lineDiscret
    case !format:
      console.log("line/plot", "(no format, isMarked:", isMarked, ")")
      
      // let ticks = dataX
      // .map((tick, index) => ({tick, index}))
      // .filter(d => d.tick.indexOf(markSymbol) > -1)
      // .map(d => d.index)

      // // if marked, b/n 4-8 ticks
      // const step = Math.ceil(ticks.length / 8)
      // ticks = ticks.filter((tick, index) => index%step === 0)
      isMarked = true//ticks.length > 3

      return /*isMarked ? ticks :*/ axisX.ticks(5)

    // most of line/plot cases
    // case rowCount >= 7:
    default:
      //console.log("line/plot", "(format, row > 7, default)")
      return axisX.ticks(5)
  }
}


export function getTickTexts(id, isBarBased, dataX, format, hasDay, domain, ticks) {
  let texts
  let year // to remove repeat years

  switch (true) {
    // number
    // bar based mostly
    case isBarBased || id==="plotScatter":
      //console.log("1:", ticks)
      texts = ticks.map(tick => numToTxt(tick))
      break

    // date - timestamp values
    // not bar based
    case hasDay:
      const dateObjToTxt = id==="lineDiscrete" ? d3.timeFormat("%d/%m %Y") : d3.timeFormat(getDateTextFormat(domain))
      //console.log("2:", ticks)
      texts = ticks.map((tick) => {
        const val = id==="lineDiscrete" ? dataX[tick] : tick
        const tic = dateObjToTxt(val).replace(year, "").trim()
        year = val.getFullYear()
        //console.log(tick, val, tic)
        return tic
      })
      break

    // date - number or index values
    // line/plot
    case !isBarBased:
      texts = ticks.map(tick => {
        const val = id==="lineDiscrete" ? dataX[tick] : tick
        const txt = format ? dateNumToTxt(val, format, hasDay) : (id==="lineDiscrete"&&isMarked ? val.replace(markSymbol, "").trim() : val.toString())
        const tic = txt.replace(year, "").trim()
        year = txt.match(/[0-9]{4}/g)
        return tic
      })
      break

    default:
      console.warn("axis-x need another condition?")
  }

  return texts
}


export function getTickTextWidths(texts) {

  const el = document.querySelector(".js-test-x")
  return texts.map(txt => {
    el.textContent = txt
    const width = Math.ceil(el.offsetWidth * 100 / 200)
    return width
  })
}


// x only
export function getTickDataEditable(id, axisTicks, axisTexts, axisDates, axisRange, format) {

  let value, ticks, range, dates
  switch (true) {
    case id.indexOf("Discrete") > -1:
      value = "index"
      ticks = axisTicks.map(i => axisDates[i])
      range = [axisDates[0], axisDates[axisDates.length-1]]
      dates = axisDates
      break
    case isNaN(parseFloat(axisTicks[0])):
      //const tickFormat = getDateTextFormat(axisRange)
      const parser = d3.timeFormat(format)
      value = "timestamp"
      ticks = axisTicks.map(value => parser(value))//axisTexts //TODO: ...
      range = [axisDates[0], axisDates[axisDates.length-1]]
      break
    default:
      value = "number"
      ticks = axisTicks.map(value => dateNumToTxt(value, format, false))
      range = axisRange.map(value => dateNumToTxt(value, format, false))//[ticks[0], ticks[ticks.length-1]]
      break
  }
  /*console.log("===")
  console.log("TODO:", value)
  console.log("[ticVal2]", axisTicks)
  console.log("[ticEdit]", ticks)
  console.log("[range  ]", range)
  console.log("===")*/

  return {value, ticks, range, dates}
}
