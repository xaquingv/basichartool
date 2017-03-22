import {d3} from '../lib/d3-lite'
import {numToTxt} from './typeNumber'
import {getDateTextFormat, dateNumToTxt} from './typeDate'

let isMarked = false
const markSymbol = "*"

export function getTickSteps(id, isBarBased, dataX, format, rowCount, axisX) {
  // TODO: add case description to this switch
  switch (true) {
    case ["brokenBar"].includes(id):
      return [50]

    case ["bar100", "barGroupStack100"].includes(id):
      return [0, 25, 50, 75, 100]

    // TODO: add 0 to id.indexOf("bar") ?

    // most bar and all line/plot cases
    case ["lineContinue, plotDot"].includes(id) || isBarBased || rowCount > 7:
      return axisX.ticks(5)

    case !format:
      let ticks = dataX
      .map((tick, index) => ({tick, index}))
      .filter(d => d.tick.indexOf(markSymbol) > -1)
      .map(d => d.index)

      // if marked, b/n 4-8 ticks
      const step = Math.ceil(ticks.length / 8)
      ticks = ticks.filter((tick, index) => index%step === 0)
      isMarked = ticks.length > 3

      return isMarked ? ticks : axisX.ticks(5)

    // rowCount < 7
    case ["lineDiscrete"].includes(id):
      return axisX.ticks(dataX.length)

    default:
      return dataX
  }
}


export function getTickTexts(id, isBarBased, dataX, format, hasDay, domain, ticks) {
  let texts
  let year // to remove repeat years

  switch (true) {
    // bar based mostly
    case isBarBased || id==="plotScatter":
      texts = ticks.map(tick => numToTxt(tick))
      break

    // not bar based
    case hasDay:
      const dateObjToTxt = id==="lineDiscrete" ? d3.timeFormat("%d/%m %Y") : d3.timeFormat(getDateTextFormat(domain))
      texts = ticks.map((tick) => {
        const val = id==="lineDiscrete" ? dataX[tick] : tick
        const tic = dateObjToTxt(val).replace(year, "").trim()
        year = val.getFullYear()
        //console.log(tick, val, tic)
        return tic
      })
      break

    case !isBarBased:
      texts = ticks.map(tick => {
        const val = id==="lineDiscrete" ? dataX[tick] : tick
        const txt = format ? dateNumToTxt(val, format, hasDay) : (isMarked ? val.replace(markSymbol, "").trim() : val.toString())
        const tic = txt.replace(year, "").trim()
        year = txt.match(/[0-9]{4}/g)
        return tic
      })
      break

    default:
      console.errror("axis-x need another condition?")
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
