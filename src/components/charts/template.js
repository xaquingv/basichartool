
export default function(graph) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      @font-face {
        font-family: "Guardian Egyptian Web";
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.eot");
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Regular.svg#GuardianEgyptianWeb-Regular") format("svg");
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
      }
      @font-face {
        font-family: "Guardian Egyptian Web";
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.eot");
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianEgyptianWeb/GuardianEgyptianWeb-Semibold.svg#GuardianEgyptianWeb-Semibold") format("svg");
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
      }
      @font-face {
        font-family: "Guardian Text Sans Web";
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.eot");
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Regular.svg#GuardianTextSansWeb-Regular") format("svg");
        font-weight: normal/*400;*/
        font-style: normal;
        font-stretch: normal;
      }
      @font-face {
        font-family: "Guardian Text Sans Web";
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.eot");
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.svg#GuardianTextSansWeb-Bold") format("svg");
        font-weight: 700;
        font-style: normal;
        font-stretch: normal;
      }
      @font-face {
        font-family: "Guardian Agate Sans 1 Web";
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.eot");
        src: url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.eot?#iefix") format("embedded-opentype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.woff2") format("woff2"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.woff") format("woff"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.ttf") format("truetype"), url("https://interactive.guim.co.uk/fonts/guss-webfonts/GuardianAgateSans1Web/GuardianAgateSans1Web-Regular.svg#GuardianAgateSans1Web-Regular") format("svg");
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
      }

      html { -webkit-font-smoothing: antialiased; }
      .d-n { display: none; }

      /* TOTHINK: style or inline */
      .graph {
        color: #767676; /*n-2*/
        font-size: 13px;
        font-family: "Guardian Text Sans Web", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .headline {
        color: black;
        font-size: 18px;
        font-family: 'Guardian Egyptian Web', Georgia, serif;
        font-weight: 600;
        line-height: 24px;
        margin-bottom: 12px;
      }
      .standfirst {
        font-size: 14px;
        line-height: 18px;
        margin-top: 12px;
        margin-bottom: 12px;
      }
      .legend {
        line-height: 18px;
        margin-bottom: 24px;
      }
      .legend-item {
        white-space: nowrap;
        display: inline-block;
        margin-right: 12px;
        position: relative;
      }
      .legend-color {
        display: inline-block;
        width: 6px;
        height: 12px;
        margin-right: 4px;
        border-radius: 2px;
        position: absolute;
        top: 1px;
      }
      .legend-label {
        pointer-events: all;
        margin-left: 10px;
      }
      svg {
        right: 0;
        padding: 1px;
      }
      svg path {
        stroke-linejoin: round;
      }
      svg, chart {
        position: absolute;
      }
      footer {
        font-size: 12px;
        line-height: 16px;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px dotted #bdbdbd; /*n-3*/
      }
      footer > div {
        word-break: break-word;
      }
      .test {
        font-size: 13px;
        font-family: 'Guardian Agate Sans 1 Web', monospace;
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
      // handle event
      var timeout = null
      window.addEventListener('resize', function(evt) {
        if (timeout) window.clearTimeout(timeout)
        timeout = window.setTimeout(function() {
          iframeMessenger.resize()  // 1.
          rescaleSvgElements()      // 2.
          updateXAxisTextPosition() // 3.
          timeout = null
        }, 200)
      });

      iframeMessenger.resize()  // 1.
      rescaleSvgElements()      // 2.
      updateXAxisTextPosition() // 3.

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
          var r = Math.round(3*width*10/svgWidth)/10
          var circles = Array.prototype.slice.call(document.querySelectorAll("circle"))
          circles.forEach(function(circle) { circle.setAttribute("r", r); })
      }}

      /* 3. x axis label position update */
      function updateXAxisTextPosition() {
        var elsTick = document.querySelectorAll(".axis-x-tick")
        var elsText = document.querySelectorAll(".axis-x-text")
        var elAxisX = document.querySelector(".axis-x")
        var elChart = document.querySelector(".js-chart")
        var elTest = document.querySelector(".js-test-res")

        // 1. default width / left
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

        var isMultiLine = txtWidths.find(w => w > maxWidth)
        var isBarBased = elChart.getAttribute("id").toLowerCase().indexOf("bar") > -1

        // 2. adjust width if multi lines
        if (isMultiLine) {
          [].slice.call(elsText).forEach((el, i) => {
            var txtWidth = el.querySelector("span").offsetWidth + 1
            var resWidth = Math.min(txtWidth, maxWidth)
            el.style.width = resWidth + "px"
            el.style.left = (elsTick[i].offsetLeft - resWidth / 2) * 100 / axisXWidth + "%"
          })
        }

        // 3. adjust two ends if out of frame
        var iLast = elsTick.length - 1
        var indent = parseInt(elAxisX.dataset.yIndent, 10)
        var textStrLeft = (indent + elsTick[0].offsetLeft) - elsText[0].offsetWidth / 2
        var textEndRight = (axisXWidth - elsTick[iLast].offsetLeft) - elsText[iLast].offsetWidth / 2
        if (textStrLeft < 0) {
          elsText[0].style.left = ((isBarBased ? 0 : 1) - indent) + "px"
          elsText[0].style.textAlign = "left"
        }
        if (textEndRight < 0) {
          elsText[iLast].style.left = "auto"
          elsText[iLast].style.right = "-1px"
          elsText[iLast].style.textAlign = "right"
        }

        // 4. update height if not bar based charts
        if (!isBarBased) {
          var heights = [].slice.call(elsText).map(el => Math.ceil(el.offsetHeight))
          var maxHeight = Math.max.apply(null, heights)
          elChart.style.marginBottom = (maxHeight + 14) + "px"
        }
      }
    </script>
  </body>
</html>`
}
