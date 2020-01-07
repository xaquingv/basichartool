import React from 'react'
import {connect} from 'react-redux'
import downloadFile from 'react-file-download'
import htmlTemplate from '../charts/template'


const mapDispatchToProps = dispatch => ({
})

const mapStateToProps = state => ({
})

class Section extends React.Component {

  downloadHTML() {
    const data = getHTMLFileData()

    // save html as a local file
    const timestamp = Date.now()
    const filename = timestamp + "-chart-" + data.id + ".html"

    downloadFile(data.html, filename)
  }

  render() {
    return (
        <input type="button" className="button btn-download" value="Download HTML" onClick={this.downloadHTML} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)


function getHTMLFileData() {
  //const elGraph = document.querySelector(".js-graph")
  const elGraph = document.querySelector(".js-article")
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