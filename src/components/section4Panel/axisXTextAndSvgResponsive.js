import {width} from '../../data/config'

export default function() {

  const elsTick = document.querySelectorAll(".axis-x-tick")
  const elsText = document.querySelectorAll(".axis-x-text")
  const elAxisX = document.querySelector(".axis-x")
  const elChart = document.querySelector(".js-chart")
  const elTest = document.querySelector(".js-test-x")

  /* update text position */
  if (!elsTick[1]) return
  const axisXWidth = elAxisX.offsetWidth
  const maxWidth = elsTick[1].offsetLeft - elsTick[0].offsetLeft
  const txtWidths = [].slice.call(elsText).map((el, i) => {
    elTest.textContent = el.textContent
    const txtWidth = elTest.offsetWidth + 2
    const resWidth = Math.min(txtWidth, maxWidth)
    el.style.width = resWidth + "px"//* 100 / axisXWidth + "%"
    el.style.left = (elsTick[i].offsetLeft - resWidth / 2) * 100 / axisXWidth + "%"
    el.style.textAlign = "center"
    el.style.backgroundColor = "transparent"
    return txtWidth
  })

  const isMultiLine = txtWidths.find(w => w > maxWidth)
  const isBarBased = elChart.dataset.id.toLowerCase().indexOf("bar") > -1

  // adjust width if multi lines
  if (isMultiLine) {
    [].slice.call(elsText).forEach((el, i) => {
      const txtWidth = el.querySelector("span").offsetWidth + 1
      const resWidth = Math.min(txtWidth, maxWidth)
      el.style.width = resWidth + "px" //* 100 / axisXWidth + "%"
      el.style.left = (elsTick[i].offsetLeft - resWidth / 2) * 100 / axisXWidth + "%"
    })
  }

  // adjust two ends if needed
  const iLast = elsTick.length - 1
  const indent = parseInt(elAxisX.dataset.yIndent, 10) + parseInt(elAxisX.dataset.lIndent, 10)
  const extend = parseInt(elAxisX.dataset.rIndent, 10) || 0
  const textStrLeft = (indent + elsTick[0].offsetLeft) - elsText[0].offsetWidth / 2
  const textEndRight = (axisXWidth + extend - elsTick[iLast].offsetLeft) - elsText[iLast].offsetWidth / 2
  //console.log(extend, textEndRight, textEndRightExtend)
  if (textStrLeft < 0) {
    elsText[0].style.left = ((isBarBased ? 0 : 1) - indent) + "px"
    elsText[0].style.textAlign = "left"
    // double check
    const txt0R = elsText[0].offsetLeft + elsText[0].offsetWidth
    const txt1L = elsText[1].offsetLeft
    if (txt0R > txt1L) {
      elsText[0].style.backgroundColor = "red"
      console.warn("[str] text overlapped!")
    }
  }
  if (textEndRight < 0) {
    elsText[iLast].style.left = "auto"
    elsText[iLast].style.right = (-1) - extend + "px"
    elsText[iLast].style.textAlign = "right"
    // double check
    const txt0ToLastL = elsText[iLast].offsetLeft
    const txt1ToLastR = elsText[iLast-1].offsetLeft + elsText[iLast-1].offsetWidth
    if (txt1ToLastR > txt0ToLastL) {
      elsText[iLast].style.backgroundColor = "red"
      console.warn("[str] text overlapped!")
    }
  }

  /* update chart height */
  if (!isBarBased) {
    // calc max text height
    const heights = [].slice.call(elsText).map(el => Math.ceil(el.offsetHeight))
    const maxHeight = Math.max.apply(null, heights)
    elChart.style.marginBottom = (maxHeight + 14) + "px"
  } else {
    elChart.style.marginBottom = 0
  }

  /* svg circle */
  const elSvg = document.querySelector("#section4 svg")
  if (elSvg) {
    var svgWidth = elSvg.getBoundingClientRect().width
    // plot chart
    var r = Math.round(3*width*10/svgWidth)/10
    var circles = [...elSvg.querySelectorAll("circle")]
    circles.forEach((circle) => circle.setAttribute("r", r))
  }
}
