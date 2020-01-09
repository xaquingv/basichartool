
export default function(graph) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      @font-face {
        font-family:"source-sans-pro";
        src:url("https://use.typekit.net/af/be76d4/00000000000000003b9b3129/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/be76d4/00000000000000003b9b3129/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/be76d4/00000000000000003b9b3129/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
        font-display:auto;font-style:normal;font-weight:400;
      }
      @font-face {
        font-family:"source-sans-pro";
        src:url("https://use.typekit.net/af/de34bd/00000000000000003b9b312d/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"),url("https://use.typekit.net/af/de34bd/00000000000000003b9b312d/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"),url("https://use.typekit.net/af/de34bd/00000000000000003b9b312d/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-display:auto;font-style:normal;font-weight:700;
      }
      @font-face {
        font-family:"source-serif-pro";
        src:url("https://use.typekit.net/af/aa546d/00000000000000003b9b3a87/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/aa546d/00000000000000003b9b3a87/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/aa546d/00000000000000003b9b3a87/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("opentype");
        font-display:auto;font-style:normal;font-weight:400;
      }
      .f-bar {
        font-family: source-sans-pro, Helvetica, Arial, sans-serif;
        color: #f1f1f1; /* n-5 */
        text-align: right;
        line-height: 16px;
        min-width: 2px;
        white-space: nowrap;
        overflow-x: hidden;
      }

      html { -webkit-font-smoothing: antialiased; }
      .d-n { display: none; }

      /* TOTHINK: style or inline */
      .graph {
        color: #767676; /*n-2*/
        font-size: 13px;
        font-family: source-sans-pro, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        margin: auto;
      }
      .chart {
        position: relative;
      }
      .header {
        margin-bottom: 30px;
        text-align: center;
      }
      .headline {
        color: black;
        font-size: 1.8rem;
        font-family: source-sans-pro, Helvetica, Arial, sans-serif;
        text-align: center;
        line-height: 1.5;
        max-width: 620px;
        margin: 30px auto 0;
      }
      .standfirst {
        font-size: 14px;
        line-height: 18px;
        margin-top: 12px;
        margin-bottom: 12px;
      }
      .paragraph {
        color: #333;
        font-size: 1.2rem;
        line-height: 1.5;
        font-family: source-serif-pro, serif;
        width: 620px;
        margin: 15px auto 30px; 
      }
      .legend {
        line-height: 18px;
      }
      .legend-item {
        white-space: nowrap;
        display: inline-block;
        margin-right: 12px;
        position: relative;
      }
      .legend-color {
        position: absolute;
        top: 3px;
        display: inline-block;
        width: .7rem;
        height: .7rem;
        border-radius: .35rem;
      }
      .legend-label {
        margin-left: 1rem;
      }
      .axis-x,
      .axis-y {
        color: #bdbdbd; /* n-3 */
        font-family: source-sans-pro, Helvetica, Arial, sans-serif;
      }
      .axis-top-text {
        white-space: nowrap;
      }
      .label {
        color: #333;
        line-height: 18px;
        vertical-align: top;
      }
      .label-x {
        font-size: 12px;
      }
      .label-x span {
        word-break: break-word
      }
      footer {
        font-size: 12px;
        line-height: 16px;
        margin-top: 6px;
        padding-top: 8px;
        border-top: 1px dotted #bdbdbd; /*n-3*/
        text-align: center;
      }
      footer > div {
        word-break: break-word;
      }
      svg {
        position: absolute;
        right: 0;
        top: -1px;
      }
      svg path {
        stroke-linejoin: round;
        /* for all but IE, use scale calc in template */
        vector-effect: non-scaling-stroke;
      }
      .test {
        font-size: 14px;
        font-family: source-sans-pro, Helvetica, Arial, sans-serif;
        visibility: hidden;
      }
      /* end of TOTHINK */

      /* for iOS safari mobile */
      body { -webkit-text-size-adjust: 100%; }
    </style>
    <script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
  </head>

    ${graph}

  <body>
    <script>
      /* TODO: add responsvie to all charts or ... */

      var elChart = document.querySelector(".js-chart")
      var elAxisX = document.querySelector(".axis-x")
      var elsText = elAxisX ? elAxisX.querySelectorAll(".axis-x-text") : []
      var indentL = elAxisX ? parseInt(elAxisX.dataset.lIndent, 10) : 0
      var extendR = elAxisX ? parseInt(elAxisX.dataset.rIndent, 10) : 0
      var isBarBased = elChart.getAttribute("data-id").toLowerCase().indexOf("bar") > -1

      // responsive
      function responsive() {
        //iframeMessenger.resize()  // 1
        rescaleSvgElements()      // 2
        updateYLabelWidths()      // 3
        updateXAxisTextPosition() // 4
        updateChartHeight()       // 5
      }
      responsive()

      // handle event
      var timeout = null
      window.addEventListener('resize', function(evt) {
        if (timeout) window.clearTimeout(timeout)
        timeout = window.setTimeout(function() {
          responsive()
          timeout = null
        }, 200)
      });

      /* 1. iframe resize */
      // iframeMessenger for embed in guardian's page

      /* 2. svg path or circle rescale */
      function rescaleSvgElements() {
        var width = 300
        var elSvg = document.querySelector("svg")
        if (elSvg) {
          var svgWidth = elSvg.getBoundingClientRect().width
          // line chart
          var strokeWidth = Math.round(2*width*10/svgWidth)/10
          var paths = Array.prototype.slice.call(document.querySelectorAll("path"))
          paths.forEach(function(path) { path.setAttribute("stroke-width", strokeWidth); })
          // plot chart
          const circles = [...elSvg.querySelectorAll("circle")]
          const viewBoxWidth = elSvg.getAttribute("viewBox").split(" ")[2]
          circles.forEach((circle) => {
            var r = circle.dataset.r;
            circle.setAttribute("r", Math.round(r * viewBoxWidth * 10 / svgWidth) / 10);
          })
      }}

      /* 3. y label width update */
      function updateYLabelWidths() {
        if (elChart.getAttribute("data-res-y") === "false") return

        const elRows = [...elChart.querySelectorAll(".row")]
        const elGroups = [...elChart.querySelectorAll(".group")]
        const elLegend = document.querySelector(".legend")
        const labelWidth = elChart.querySelector(".label").offsetWidth
        const chartWidth = elChart.offsetWidth
        const isInline = labelWidth <= chartWidth/3

        elRows.forEach(el => {
          el.style.height = isInline ? "24px" : "auto"
        })
        elGroups.forEach(el => {
          el.style.width = isInline ? "calc(" + 100 + "% - " + labelWidth + "px)" : "100%"
          el.style.display = isInline ? "inline-block" : "block"
        })

        elAxisX.style.width = "calc(100% - " + ((isInline ? labelWidth : 0) + indentL + extendR + 1) + "px)"
        elLegend.style.marginLeft = isInline ? labelWidth + "px" : 0
      }

      /* 4. x axis text position update */
      function updateXAxisTextPosition() {
        if (!elAxisX) return

        var elsTick = elAxisX.querySelectorAll(".axis-x-tick")
        var elTest = document.querySelector(".js-test-res")

        // a. default width / left
        var axisXWidth = elAxisX.offsetWidth
        var maxWidth = elsTick[1].offsetLeft - elsTick[0].offsetLeft
        var txtWidths = [].slice.call(elsText).map((el, i) => {
          elTest.textContent = el.textContent
          var txtWidth = elTest.offsetWidth + 2
          var resWidth = Math.min(txtWidth, maxWidth)
          el.style.width = resWidth + "px"
          el.style.left = (elsTick[i].offsetLeft - resWidth / 2) * 100 / axisXWidth + "%"
          el.style.textAlign = "center"
          return txtWidth
        })
        elTest.textContent = ""

        // b. adjust width if multi lines
        var isMultiLine = txtWidths.find(w => w > maxWidth)
        if (isMultiLine) {
          [].slice.call(elsText).forEach((el, i) => {
            var txtWidth = el.querySelector("span").offsetWidth + 1
            var resWidth = Math.min(txtWidth, maxWidth)
            el.style.width = resWidth + "px"
            el.style.left = (elsTick[i].offsetLeft - resWidth / 2) * 100 / axisXWidth + "%"
          })
        }

        // c. adjust two ends if out of frame
        var iLast = elsTick.length - 1
        var indent = parseInt(elAxisX.dataset.yIndent, 10) + indentL
        var textStrLeft = (indent + elsTick[0].offsetLeft) - elsText[0].offsetWidth / 2
        var textEndRight = (axisXWidth + extendR - elsTick[iLast].offsetLeft) - elsText[iLast].offsetWidth / 2
        if (textStrLeft < 0) {
          elsText[0].style.left = ((isBarBased ? 0 : 1) - indent) + "px"
          elsText[0].style.textAlign = "left"
        }
        if (textEndRight < 0) {
          elsText[iLast].style.left = "auto"
          elsText[iLast].style.right = (-1) - extendR + "px"
          elsText[iLast].style.textAlign = "right"
        }
      }

      /* chart height update */
      function updateChartHeight() {
        var elsLabel = document.querySelectorAll(".label-x .label")
        var isAxisXBottom = elAxisX ? (elAxisX.dataset.xBottom==="true") : false
        if (isAxisXBottom || elsLabel.length > 0) {
          var elsAll = [].slice.call(elsText).concat([].slice.call(elsLabel))
          var heights = elsAll.map(el => Math.ceil(el.offsetHeight))
          var maxHeight = Math.max.apply(null, heights)
          elChart.style.marginBottom = (maxHeight + 14) + "px"
        }
      }
    </script>
  </body>
</html>`
}
