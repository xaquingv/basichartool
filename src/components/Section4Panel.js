import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import {d3} from '../lib/d3-lite'
import scrollTo from '../lib/scrollTo'
import {metaKeys, default_metaText} from '../data/config'

import ComponentSize    from './section4Panel/Size'
import ComponentPalette from './section4Panel/Palette'
import ComponentDisplay from './section4Panel/Display'
import ComponentLegend  from './section4Panel/Legend'
import ComponentAxisX   from './section4Panel/AxisX'
import ComponentAxisY   from './section4Panel/AxisY'
import {chartList} from './charts'


const STEP = 4;

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  chartId: state.chartId,
  svgIndent: state.dataChart.indent,
  svgHeight: state.dataChart.height,
  metaData: state.dataTable.meta,
  display: state.dataSetup.display
});

const mapDispatchToProps = (dispatch) => ({
});


class Section extends React.Component {

  //shouldComponentUpdate(nextProps) {
  //  return nextProps.step === STEP
  //}

  componentDidUpdate() {

    const {stepActive, svgIndent, svgHeight, metaData, display} = this.props
    if (stepActive < STEP) return

    // set svg size
    const elSvg = document.querySelector("#section4 svg")
    if (elSvg) {
      elSvg.setAttribute("viewBox", "0 0 300 180")
      elSvg.setAttribute("preserveAspectRatio", "none")
      //console.log("p indent", indent)

      // rescale on axis-y controll
      elSvg.style.top = 0
      elSvg.style.height = "calc(" + svgHeight + "% - 2px)"
      elSvg.style.width = "calc(100% - " + svgIndent + "px)"
    }

    // set meta values and display
    metaKeys.forEach(key => {
      const textIfSourcePatch = (key === "source" && metaData.source ? " | Source: " : "")
      const text = textIfSourcePatch + (metaData[key] || default_metaText[key])
      d3.select(this.refs[key])
      .classed("d-n", !display[key])
      .text(text)
    })

    // TODO: replace with 1. dispatch scrollSteps
    // to let Navigation.js take care of it ...
    // or attach a scroll event ...
    const to = document.querySelector("#section4").offsetTop - 80
    scrollTo(to, null, 1000)
  }


  render() {

    const {stepActive, chartId/*, dataChart*/} = this.props;

    // TODO: responsive width
    const isBarBased = chartId.toLowerCase().indexOf("bar") > -1
    const ComponentChart = chartList[chartId]
    const chartComponent = ComponentChart
    ? (
      <div id={chartId+"_edit"} data-id={chartId} className="chart-edit js-chart" style={{
        marginTop: isBarBased ? "30px" : 0,
        marginBottom: isBarBased ? 0 : "30px",
        paddingBottom: isBarBased ? false : "60%"
      }}>
        <ComponentAxisY />
        <ComponentAxisX />
        <ComponentChart id={chartId+"_edit"} callByStep={STEP} width={300} />
      </div>
    )
    : null

    const graphComponent = stepActive >= STEP
    ? (
      <div className="graph js-graph">
        <header className="header">
          <div className="headline" ref="headline"></div>
          <div className="standfirst" ref="standfirst"></div>
          <ComponentLegend />
        </header>
        {chartComponent}
        <footer>
          Guardian Graphic
          <span ref="source"></span>
        </footer>
      </div>
    )
    : null

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section4">
        <h1>4. Edit your graph</h1>

        <div className="setup1">
          <ComponentSize />
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
