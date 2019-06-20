// import {width} from '../../data/config'

export default function() {
  const elsText = document.querySelectorAll(".label-x .label")
  const elChart = document.querySelector(".js-chart")

  const heights = [].slice.call(elsText).map(el => Math.ceil(el.offsetHeight))
  const maxHeight = (Math.max.apply(null, heights) + 14) + "px"

  if (maxHeight !== elChart.style.marginBottom) {
    elChart.style.marginBottom = maxHeight
    //console.log("res label:", maxHeight, elChart.style.marginBottom)
  }

  /*/ brokenBar100.js return
  // TODO: hide if too small
  if (elChart.dataset.id === "brokenBar100") {
    console.log("layout update")

    const elsNum = [...document.querySelectorAll(".num")]
    const elsStr = [...document.querySelectorAll(".str")]

    //test
    if (elsNum.length === 0) return
    const elTest = document.querySelector(".js-test-y")
    const maxWidthStrs = elsStr.map(str => {
      const txts = str.innerText.split(" ")
      const lens = txts.map(txt => {
          elTest.textContent = txt
          //console.log(txt, elTest.offsetWidth)
          return elTest.offsetWidth
      })
      return Math.max.apply(null, lens)
    })

    const elsTxts = [...document.querySelectorAll(".txts")]
    const defaultWidths = elsTxts.map(el => parseFloat(el.dataset.width))
    console.log(defaultWidths)
    //this.dataChart.map(d => d.width)
    const maxWidthTxtsData = elsNum.map((num, i) => {
      const max = Math.max(num.offsetWidth, maxWidthStrs[i]) + 4 // space
      const maxInPercent = Math.round(max*10000/width)/100
      console.log(
        num.offsetWidth, num.textContent,
        maxWidthStrs[i], elsStr[i].textContent,
        "=>", max, //maxInPercent+"%",
        Math.round(defaultWidths[i]*width/100),
        defaultWidths[i]+"%",
        maxInPercent > defaultWidths[i]
      )
      return {
        flag: maxInPercent > defaultWidths[i] ? "right" : false,
        min_px: max,
        min_pc: maxInPercent,
        // default
        adjust: defaultWidths[i],
        add_pc: 0,
        reduce_px: 0
      }
    })
    const sumWidthTxtsMinPc = maxWidthTxtsData.map(n => n.min_pc).reduce((n1, n2) => n1+n2)
    console.log(maxWidthTxtsData, sumWidthTxtsMinPc)

    // adjust
    if (sumWidthTxtsMinPc > 100) {
      // TODO: loop through removing the smallest width and try again ...
      console.warn("canvas width too small!")
      return
    }

    // right
    maxWidthTxtsData.forEach((d, i) => {
      if (d.flag === "right") {
        const widthData = maxWidthTxtsData.slice(i, maxWidthTxtsData.length - i)
        const widthMinPc = widthData.map(n => n.min_pc)
        const widthAdjPc = widthData.map(n => n.adjust)
        const indexJ = widthData.findIndex((d, j) => {
          /*console.log(i, i+j)
          console.log(widthMinPc.slice(0, j+1), widthMinPc.slice(0, j+1).reduce((n1, n2) => n1+n2))
          console.log(widthAdjPc.slice(0, j+1), widthAdjPc.slice(0, j+1).reduce((n1, n2) => n1+n2))
          console.log(
            widthMinPc.slice(0, j+1).reduce((n1, n2) => n1+n2) <
            widthAdjPc.slice(0, j+1).reduce((n1, n2) => n1+n2)
          )* /
          return widthMinPc.slice(0, j+1).reduce((n1, n2) => n1+n2) < widthAdjPc.slice(0, j+1).reduce((n1, n2) => n1+n2)
        })
        if (indexJ === -1) {
          maxWidthTxtsData[i].flag = "left"
          return
        }
        const iAdjust = i + indexJ
        console.log("adjust", i, "=>", iAdjust)
        console.log(widthMinPc.slice(0, indexJ+1), widthMinPc.slice(0, indexJ+1).reduce((n1, n2) => n1+n2))
        console.log(widthAdjPc.slice(0, indexJ+1), widthAdjPc.slice(0, indexJ+1).reduce((n1, n2) => n1+n2))

        console.log(maxWidthTxtsData[iAdjust].adjust, d.min_pc, "=>", maxWidthTxtsData[iAdjust].adjust - d.min_pc)
        console.log(elsTxts[i])
        elsTxts[i].style.width = d.min_px + "px"
        maxWidthTxtsData[i].adjust = d.min_px + "px"
        maxWidthTxtsData[iAdjust].reduce_px += d.min_px
        maxWidthTxtsData[iAdjust].add_pc += defaultWidths[i]
        maxWidthTxtsData[iAdjust].adjust += (defaultWidths[i] - d.min_pc)
        console.log(i, d)
        console.log(iAdjust, maxWidthTxtsData[iAdjust])
      }
    })
    maxWidthTxtsData.forEach((d, i) => {
      if (!d.flag && d.reduce_px!==0) {
        elsTxts[i].style.width = "calc(" + (defaultWidths[i]+d.add_pc) + "% - " + d.reduce_px + "px)"
      }
    })
    console.log(maxWidthTxtsData)
  }*/
}
