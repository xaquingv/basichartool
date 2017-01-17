import React from 'react'
import {connect} from 'react-redux'
import downloadFile from 'react-file-download'
import htmlTemplate from './charts/template'
//import fetch from 'isomorphic-fetch'
import reqwest from 'reqwest'

const STEP = 5
const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  stepActive: state.stepActive
})


class Section extends React.Component {
  embed() {
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
      <h1>5. Voila, take away your chart</h1>
      <input type="button" className="button" value="embed" onClick={this.embed.bind(this)} />
      <input type="button" className="button" value="download HTML" onClick={this.downloadHTML.bind(this)} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)


function getHTMLFileData() {
  const elGraph = document.querySelector("#section4 .js-graph")
  const chartId = elGraph.querySelector(".js-chart").dataset.id
  const htmlGrpah = elGraph.cloneNode(true).outerHTML
  return {
    id: chartId,
    html: htmlTemplate(htmlGrpah)
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
      console.log(res)
    },
    error: err => {
      console.log(err)
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
