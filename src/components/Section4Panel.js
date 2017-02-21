import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import {d3} from '../lib/d3-lite'
import scrollTo from '../lib/scrollTo'
import {metaKeys, default_metaText, ratio} from '../data/config'
import {updateSize} from '../actions'
import {chartList} from './charts'

import ComponentSize        from './section4Panel/Size'
import ComponentResponsive  from './section4Panel/Responsive'
import ComponentPalette     from './section4Panel/Palette'
import ComponentDisplay     from './section4Panel/Display'
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

  componentDidUpdate() {
    const {stepActive, metaData, display, setSize, chartData} = this.props
    if (stepActive < STEP) return

    /* header */
    // set meta values and display
    metaKeys.forEach(key => {
      const textIfSourcePatch = metaData.source ? " | Source: " : ""
      const textCredit = (key === "source" ? "Guardian Graphic" + textIfSourcePatch : "")
      const text = textCredit + (metaData[key] || default_metaText[key])
      d3.select(this.refs[key])
      .classed("d-n", !display[key])
      .text(text)
    })


    /* chart */
    // set chart size to setup1
    const elChart = document.querySelector(".js-chart")
    setTimeout(() => setSize({w: elChart.offsetWidth, h: elChart.offsetHeight}), 1000)
    // NOTE: setTimeout due to css transition

    // axes
    // res y labels and x axis' label posiitons
    const {scales, string1Width} = chartData
    if (scales.x) {
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

    const {stepActive, chartId, graphWidth, chartData} = this.props;

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
        <header className="header">
          <div className="headline" ref="headline"></div>
          <div className="standfirst" ref="standfirst"></div>
          <ComponentLegend isBarBased={isBarBased}/>
        </header>
        {chartComponent}
        <footer ref="source"></footer>
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
