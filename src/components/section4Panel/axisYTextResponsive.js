export default function(labelWidth) {

  const el = document.querySelector(".js-chart")
  if (!el.dataset.resY) return

  const elRows = [...el.querySelectorAll(".row")]
  const elGroups = [...el.querySelectorAll(".group")]
  const chartWidth = el.offsetWidth
  const isInline = labelWidth <= chartWidth/3

  elRows.forEach(el => {
    el.style.height = isInline ? "24px" : "auto"
  })

  elGroups.forEach(el => {
    el.style.width = isInline ? "calc(" + 100 + "% - " + labelWidth + "px)" : "100%"
    el.style.display = isInline ? "inline-block" : "block"
  })
}
