import {width} from '../data/config'

const spaceLabel = 12
const spaceTickText = 6

export function getString1DataRes(rowGroup) {
  const elTest = document.querySelector(".js-test-y")
  const string1Width = rowGroup ?
    Math.max.apply(null, rowGroup.map(str => {
      elTest.innerHTML/*.textContent*/ = str
      return elTest.offsetWidth
    })) + spaceLabel :
    0
  const string1IsRes = string1Width > width/3

  return {
    string1Width,
    string1IsRes
  }
}

export function getAxisYLabelRes() {
  const elTest = document.querySelector(".js-test-y")
  const elLabels = [...document.querySelectorAll(".label")]
  const string1Width = Math.max.apply(null, elLabels.map(el => {
    elTest.textContent = el.innerText
    return elTest.offsetWidth
  })) + spaceLabel
  const string1IsRes = string1Width > Math.round(width/3)

  return {
    string1Width,
    string1IsRes
  }
}

export function getAxisYLabelChange(oldLabels) {
  const elLabels = [...document.querySelectorAll(".label")]
  const index = elLabels.findIndex((el, i) => el.innerText !== oldLabels[i])
  return index > -1 ? {
    index,
    label: elLabels[index].innerText
  } : null
}

export function getAxisYTextWidth(chartId) {
  const els = [...document.querySelectorAll(".axis-y-text")].slice(0, -1)
  const widths = els.map(el => el.offsetWidth)
  const isPlot = chartId.toLowerCase().indexOf("plot") > -1
  const indent = Math.max.apply(null, widths) + spaceTickText + (isPlot ? 3 : 0)
  return indent
}
