import React from 'react';
import { connect } from 'react-redux';
import './section3Edit.css'
// import scrollTo from '../lib/scrollTo'
import { default_metaText, ratio } from '../data/config'
import { chartComponents } from './charts'
import { updateWidth, setParagraph } from '../actions'

import ComponentSize from './section3Edit/Size'
import ComponentResponsive from './section3Edit/Responsive'
import ComponentPalette from './section3Edit/Palette'
import ComponentDisplay from './section3Edit/Display'
import ComponentEditor from './section3Edit/Editor'
import ComponentLegend from './section3Edit/Legend'
import ComponentXLabel from './section3Edit/LabelX'
import ComponentSetAxis from './section3Edit/SetAxis'
import ComponentXAxis from './section3Edit/AxisX'
import ComponentYAxis from './section3Edit/AxisY'
import responsiveXTexts from './section3Edit/axisXTextAndSvgResponsive'
import responsiveXLabel from './section3Edit/axisXLabelResponsive'
import responsiveYTexts from './section3Edit/axisYTextResponsive'

const STEP = 3;

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  chartId: state.chartId,
  chartData: state.dataChart,
  metaData: state.dataTable.meta,
  display: state.dataSetup.display,
  graphWidth: state.dataSetup.width,
  axis: state.dataEditable.axis,

  width: state.dataSetup.width,
  paragraphData: state.dataParagraph
})

const mapDispatchToProps = (dispatch) => ({
  setWidth: (width) => dispatch(updateWidth(width)),
  setDataParagraph: (paragraph) => dispatch(setParagraph(paragraph))
})


class Section extends React.Component {
  getMetaText(type) {
    const metaData = this.props.metaData
    const textIfSourcePatch = metaData.source ? " | Source: " : ""
    const textCredit = (type === "source" ? "by RODA" + textIfSourcePatch : "")
    return textCredit + (metaData[type] || default_metaText[type])
  }

  handleEdit(event, index) {
    const { paragraphData, setDataParagraph } = this.props
    let paragraphs = [...paragraphData]
    paragraphs[index].paragraph = event.target.value

    setDataParagraph(paragraphs)
  }
  
  setHighlight() {
    const {paragraphData} = this.props
    const els = document.querySelectorAll(".js-graph");
    [...els].forEach((els, idx) => {
      const titles = paragraphData[idx].data.key.replace("and ", "").split(", ");
      console.log(titles)
      titles.forEach(title => {
        let elCircle = els.querySelector('circle[title^="' + title + '"]');
        console.log(elCircle)
        elCircle.setAttribute("stroke", "black")
        elCircle.setAttribute("stroke-width", "2")
      })
    })
  }

  componentDidMount() {
    this.props.setWidth("860px")
  }
  componentDidUpdate() {
    const { stepActive, chartId, chartData} = this.props
    if (stepActive < STEP) return

    /* chart axes responsive */
    // x-text-top/bottom (with ticks), y-text (with ticks), and y-label's posiitons
    // due to tick or text/label editing
    if (chartData.scales.x || chartId.includes("col")) {
      responsiveYTexts(chartData.string1Width)
      responsiveXTexts()
      responsiveXLabel()
    }

    /* navigation */
    // TODO: replace with 1. dispatch scrollSteps
    // to let Navigation.js take care of it or ...
    //const to = document.querySelector("#section3").offsetTop - 60
    //scrollTo(to, null, 1000)

    /* highlight */
    //setTimeout({
      // const {paragraphData} = this.props
      // const els = document.querySelectorAll(".js-graph");
      // [...els].forEach((els, idx) => {
      //   const titles = paragraphData[idx].data.key.replace("and ", "").split(", ");
      //     elCircle.setAttribute("stroke", "black")
      //     elCircle.setAttribute("stroke-width", "2")
      //   })
      // })
    //}, 1000)
    // console.log("hightlight", chartData.ranges)
  }


  render() {
    const { stepActive, chartId, graphWidth, chartData, paragraphData, display } = this.props;
    const isOnBar = chartId.includes("onBar")
    const isBarBased = chartId.toLowerCase().includes("bar") //&& !chartId.includes("broken")
    const isPlot = chartId.toLowerCase().includes("plot")
    const isRender = stepActive >= STEP
    if (isRender) console.log("render step 3:", paragraphData)

    const ComponentChart = chartComponents[chartId]
    const chartComponent = ComponentChart
      ? (
        <div
          data-id={chartId} data-res-y={chartData.string1IsRes && isBarBased} className="chart js-chart" style={{
            marginTop: isBarBased ? "24px" : 0,
            marginBottom: isBarBased ? 0 : "30px",
            paddingBottom: isBarBased ? "1px" : (ratio * 100) + "%",
            // 1px for barBasaed to keep chart's height
          }}>
          <ComponentYAxis />
          <ComponentXAxis isBarBased={isBarBased} isOnBar={isOnBar} isPlot={isPlot} />
          <ComponentChart id={chartId + "_edit"} callByStep={STEP} />
          <ComponentXLabel />
        </div>
      ) : null

    const graphComponent = isRender
      ? (
        <div className="graph js-graph" style={{ width: graphWidth }}>
          {/* header */}
          <header className="header">
            {/* <div className={"headline" + (display["headline"] ? "" : " d-n")} >
              <ComponentEditor text={this.getMetaText("headline")} bold={true} />
            </div> */}
            <div className={"standfirst" + (display["standfirst"] ? "" : " d-n")}>
              <ComponentEditor text={this.getMetaText("standfirst")} />
            </div>
            <ComponentLegend isBarBased={isBarBased} />
          </header>
          {/* main: graph / chart */}
          {chartComponent}
          {/* footer */}
          <footer className={display["source"] ? "" : " d-n"}>
            <ComponentEditor text={this.getMetaText("source")} />
          </footer>
          <span className="test js-test-res"></span>
        </div>
      ) : null

    const setupComponent = isRender
      ? (
        <div className="setup row-flex">
          <div className="setup-p1">
            <ComponentSize />
            <ComponentResponsive />
            <ComponentPalette />
            <ComponentDisplay />
          </div>
          <div className="setup-p2">
            <ComponentSetAxis type="x" />
            <ComponentSetAxis type="y" />
          </div>
        </div>
      ) : null

    return (
      <div className={"section" + ((isRender) ? "" : " d-n")} id="section3">
        <h1>3. Edit your Visualization</h1>
        
        {/* 3.1: setup */}
        {setupComponent}

        {/* 3.2: article with paragraph(es) and graph(s) */}
        {/* note that any styles inside graph needs to be either included in the template.js or inline */}
        <div className="headline"><ComponentEditor text={"Headline"} bold={true} /></div>
        {paragraphData ? paragraphData.map((p, i) =>
            <div key={"p-" + i} id={"p-" + i}>
              <div className="paragraph"><ComponentEditor text={p} /></div>
              {graphComponent}
            </div>
        ) : null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
