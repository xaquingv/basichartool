import React from 'react'
import {connect} from 'react-redux'
import './section5Embed.css'

import downloadFile from 'react-file-download'
import htmlTemplate from './charts/template'
import reqwest from 'reqwest'


const STEP = 3
// const instruction = "Note that the embed link button is only avaiable via the Guardian's visual tool."

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  stepActive: state.stepActive
})

const isGuardianVisual = location.origin.indexOf("visuals.gutools.co.uk") > -1
//console.log("dev mode:", !isGuardianVisual)


class Section extends React.Component {
  embed() {
    // return in dev mode
    if (!isGuardianVisual) return

    const data = getHTMLFileData()

    // TODO: push html to s3 server
    // console.log(data.html)
    // console.log(JSON.stringify({ embed: data.html }))

    pushToS3ByReqwest(data)

    // TODO: debug for fetch issue
    // if (fetch) {
    //   pushToS3ByFetch(data)
    // } else {
    //  console.log("fetch is not working on your browser!")
    // }
  }

  downloadHTML() {
    const data = getHTMLFileData()

    // save html as a local file
    const timestamp = Date.now()
    const filename = timestamp + "-chart-" + data.id + ".html"

    downloadFile(data.html, filename)
  }

  render() {
    const {stepActive} = this.props;
    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section5">
        {/* <h1>5. Voila, here you go:</h1> */}
        {/* <p className="instruction">{instruction}</p> */}
        <input type="button" className={"button" + (isGuardianVisual ? "" : " btn-off")} value="embed" onClick={this.embed.bind(this)} />
        <input type="button" className="button" value="download HTML" onClick={this.downloadHTML.bind(this)} />
        <div className="d-n link js-link">link: <a target="_blank"></a></div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)


function getHTMLFileData() {
  const elGraph = document.querySelector(".js-graph")
  const chartId = elGraph.querySelector(".js-chart").dataset.id
  const elGraphCopy = elGraph.cloneNode(true)
  elGraphCopy.style.width = "100%"

  // remove editors' elements created by Draft.js and
  // replace them with content only (a list of spans)
  const elEditors = [...elGraphCopy.querySelectorAll(".DraftEditor-root")]
  elEditors.forEach(elEditor => {
    const elParent = elEditor.parentNode
    const elContent = elEditor.querySelector("span").parentNode.innerHTML
    elParent.removeChild(elEditor)
    elParent.innerHTML = elContent

    // TODO: remove data attributes
    //...
  })

  const htmlGraph = elGraphCopy.outerHTML
  return {
    id: chartId,
    html: htmlTemplate(htmlGraph)
  }
}

function pushToS3ByReqwest(data) {
  reqwest({
    url: 'https://visuals.gutools.co.uk/embed-uploader?type=chart',
    method: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
        embed: data.html
    }),
    success: res => {
      let elLink = document.querySelector(".js-link")
      let elLinkA = elLink.querySelector("a")
      elLink.classList.remove("d-n")
      elLinkA.href = res
      elLinkA.textContent = res

      setTimeout(() => {
        elLink.classList.add("d-n")
      }, 60000)
      //console.log(res)
    },
    error: err => {
      console.warn(err)
    }
  })
}

/*function pushToS3ByFetch(data) {
  fetch('https://visuals.gutools.co.uk/embed-uploader?type=chart', {
    method: 'POST',
    body: JSON.stringify({ embed: data.html }),
    data: JSON.stringify({ embed: data.html }),
    headers: new Headers({
      //'Accept': 'application/json',
      'Content-Type': 'text/html'//'application/json'
    })
  }).then((res) => {
    console.log(res)
    //return res.json()
  }).catch((err) => {
    console.log(err)
  })
}*/
