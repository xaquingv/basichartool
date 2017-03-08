import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import scrollTo from '../lib/scrollTo'
import {default_metaText, ratio} from '../data/config'
import {updateSize} from '../actions'
import {chartList} from './charts'

import ComponentSize        from './section4Panel/Size'
import ComponentResponsive  from './section4Panel/Responsive'
import ComponentPalette     from './section4Panel/Palette'
import ComponentDisplay     from './section4Panel/Display'
import ComponentEditor      from './section4Panel/Editor'
import ComponentLegend      from './section4Panel/Legend'
import ComponentXAxis       from './section4Panel/AxisX'
import ComponentYAxis       from './section4Panel/AxisY'
import axisXResponsive      from './section4Panel/axisXTextAndSvgResponsive'
import axisYResponsive      from './section4Panel/axisYTextResponsive'


const STEP = 4;

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  chartId: state.chartId,
  chartData: state.dataChart,
  metaData: state.dataTable.meta,
  display: state.dataSetup.display,
  graphWidth: state.dataSetup.width,
});

const mapDispatchToProps = (dispatch) => ({
  setSize: (size) => dispatch(updateSize(size))
});


class Section extends React.Component {
  getMetaText(type) {
    const metaData = this.props.metaData
    const textIfSourcePatch = metaData.source ? " | Source: " : ""
    const textCredit = (type === "source" ? "Guardian Graphic" + textIfSourcePatch : "")
    return textCredit + (metaData[type] || default_metaText[type])
  }

  componentDidUpdate() {
    const {stepActive, setSize, chartData} = this.props
    if (stepActive < STEP) return

    /* chart, for responsive */
    // set chart size to setup1
    const elChart = document.querySelector(".js-chart")
    setTimeout(() => setSize({w: elChart.offsetWidth, h: elChart.offsetHeight}), 1000)
    // NOTE: setTimeout due to css transition

    // axes
    // res y labels and x axis' label posiitons
    const {scales, string1Width} = chartData
    if (scales.x) {
      axisYResponsive(string1Width)
      axisXResponsive()
      setTimeout(() => {
        axisYResponsive(string1Width)
        axisXResponsive()
      }, 1000)
    }

    /* navigation */
    // TODO: replace with 1. dispatch scrollSteps
    // to let Navigation.js take care of it or ...
    const to = document.querySelector("#section4").offsetTop - 60
    scrollTo(to, null, 1000)
  }


  render() {

    const {stepActive, chartId, graphWidth, chartData, display} = this.props;

    // TODO: responsive width
    const isOnBar = chartId.indexOf("onBar") > -1
    const isBarBased = chartId.toLowerCase().indexOf("bar") > -1
    const isPlot = chartId.toLowerCase().indexOf("plot") > -1
    const ComponentChart = chartList[chartId]
    const chartComponent = ComponentChart
    ? (
      <div
        data-id={chartId} data-res-y={chartData.string1IsRes && isBarBased} className="chart js-chart" style={{
        marginTop: isBarBased ? "24px" : 0,
        marginBottom: isBarBased ? 0 : "30px",
        paddingBottom: isBarBased ? "1px" : (ratio*100) + "%",
        // 1px for barBasaed to keep chart's height
      }}>
        <ComponentXAxis isBarBased={isBarBased} isOnBar={isOnBar} isPlot={isPlot}/>
        <ComponentYAxis isPlot={isPlot}/>
        <ComponentChart id={chartId+"_edit"} callByStep={STEP} />
      </div>
    )
    : null

    const graphComponent = stepActive >= STEP
    ? (
      <div className="graph js-graph" style={{width: graphWidth}}>
        {/* header */}
        <header className="header">
          <div className={"headline" + (display["headline"] ? "" : " d-n")} >
            <ComponentEditor text={this.getMetaText("headline")} bold={true} />
          </div>
          <div className={"standfirst" + (display["standfirst"] ? "" : " d-n")}>
            <ComponentEditor text={this.getMetaText("standfirst")} />
          </div>
          <ComponentLegend isBarBased={isBarBased}/>
        </header>

        {/* main: graph / chart */}
        {chartComponent}

        {/* footer */}
        <footer className={display["source"] ? "" : " d-n"}>
          <ComponentEditor text={this.getMetaText("source")} />
        </footer>
        <span className="test js-test-res"></span>
      </div>
    )
    : null

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section4">
        <h1>4. Edit your graph</h1>

        <div className="setup1">
          <ComponentSize />
          <ComponentResponsive />
          <ComponentPalette />
          <ComponentDisplay />
        </div>

        <div className="setup2"></div>

        {/* any styles inside graph needs to be either included in the template.js or inline */}
        {graphComponent}
        {/* end of graph */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
