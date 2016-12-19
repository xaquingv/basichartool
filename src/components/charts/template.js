
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

      /* TOTHINK: style or inline */
      .graph {
        color: #767676; /*n-2*/
        font-size: 13px;
        font-family: "Guardian Text Sans Web", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
        -webkit-font-smoothing: antialiased;
        width: 100%;
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
        margin-top: 12px;
        margin-bottom: 16px;
      }
      footer {
        font-size: 12px;
        line-height: 16px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dotted #bdbdbd; /*n-3*/
      }
      footer > div {
        word-break: break-word;
      }
      /* end of TOTHINK */

      html { -webkit-font-smoothing: antialiased; }
      /* for iOS safari mobile */
      body { -webkit-text-size-adjust: 100%; }
      /* for all but IE */
      path { vector-effect: non-scaling-stroke; }
      .d-n { display: none; }
    </style>
    <script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
  </head>

    ${graph}

  <body>
    <script>
      // handle event
      var timeout = null;
      window.addEventListener('resize', function(evt) {
        if (timeout) window.clearTimeout(timeout);
        timeout = window.setTimeout(function() {
          iframeMessenger.resize();
          timeout = null;
        }, 200);
      });
      iframeMessenger.resize();
    </script>
  </body>
</html>`
}
