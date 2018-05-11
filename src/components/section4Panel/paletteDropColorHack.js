import {rgbToHex} from '../../lib/utils'

export function isHighlight(step) {
  if (step!==4) {
    return false
  } else {
    const elLegend = document.querySelector(".legend")
    const noColors = elLegend ? elLegend.querySelectorAll(".legend-item").length === 0 : false
    return elLegend && noColors
  }
}

export function dropColorToHighlight(index, styleCSS) {
  const elColorPicked = document.querySelector(".color-picked")
  const colorPicked = elColorPicked ? elColorPicked.style.fill : null

  if (colorPicked) {
    const elColor = document.querySelector(".c" + index)
    elColor.style[styleCSS] = colorPicked
  }
}

export function dropColorOnShape(colorClass, isEven) {
  const elS4 = document.querySelector("#section4")
  const elColorPicked = elS4.querySelector(".color-picked")
  const colorPicked = elColorPicked ? elColorPicked.style.fill : null

  if (colorPicked) {
    const elsHead = [...elS4.querySelectorAll(".head.c" + colorClass)]
    const elsLine = [...elS4.querySelectorAll(".line.c" + colorClass)]

    const hexColor = rgbToHex(colorPicked)
    elsHead.map(el => el.style.borderColor = isEven ? hexColor : ("transparent " + hexColor))
    elsLine.map(el => el.style.backgroundColor = isEven ? false : hexColor)

    // for sticks in onBar.js call by chart onBarDots
    elS4.querySelector(".canvas").dataset.bgColor = hexColor
  }
}
