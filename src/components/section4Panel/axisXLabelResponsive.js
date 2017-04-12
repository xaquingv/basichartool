export default function() {
  const elsText = document.querySelectorAll(".label-x .label")
  const elChart = document.querySelector(".js-chart")

  const heights = [].slice.call(elsText).map(el => Math.ceil(el.offsetHeight))
  const maxHeight = (Math.max.apply(null, heights) + 14) + "px"

  if (maxHeight !== elChart.style.marginBottom) {
    elChart.style.marginBottom = maxHeight
    //console.log("res label:", maxHeight, elChart.style.marginBottom)
  }
}
