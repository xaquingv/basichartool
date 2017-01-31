import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import {chartList} from './charts'
import {d3} from '../lib/d3-lite'
import scrollTo from '../lib/scrollTo'
import {metaKeys, default_metaText} from '../data/config'

import ComponentKey from './section4Panel/Key'
import ComponentPalette from './section4Panel/Palette'

const STEP = 4;

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  chartId: state.chartId,
  dataMeta: state.dataTable.meta
});


class Section extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.step === STEP
  }
  componentDidUpdate() {
    const metaData = this.props.dataMeta
    metaKeys.forEach(key => {
      const textIfSourcePatch = (key === "source" && metaData.source ? " | Source: " : "")
      const text = textIfSourcePatch + (metaData[key] || default_metaText[key])
      d3.select(this.refs[key]).text(text)
    })

    const elSvg = document.querySelector("#section4 svg")
    if (elSvg) {
      elSvg.setAttribute("viewBox", "0 0 300 180")
      elSvg.setAttribute("preserveAspectRatio", "none")
    }

    const elChart = document.querySelector(".js-chart")
    d3.select(this.refs.width).text(elChart.offsetWidth)
    d3.select(this.refs.height).text(elChart.offsetHeight)

    // TODO: replace with 1. dispatch scrollSteps
    // to let Navigation.js take care of it ...
    // or attach a scroll event ...
    const to = document.querySelector("#section4").offsetTop - 80
    scrollTo(to, null, 1000)
  }

  render() {

    const {stepActive, chartId} = this.props;

    // TODO: responsive width
    const ComponentChart = chartList[chartId]
    const chartComponent = ComponentChart
    ? (
      <div data-id={chartId} id={chartId+"_edit"} className="chart-edit js-chart">
        <ComponentKey />
        <ComponentChart id={chartId+"_edit"} callByStep={STEP} width={300} />
      </div>
    )
    : null

    const setupDisplayList = metaKeys.map((key, i) =>
      <span key={key}>{key}</span>
    )

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section4">
        <h1>4. Edit your graph</h1>

        <div className="setup1">
          <div>Width x Height:
            <span ref="width"></span>x
            <span ref="height"></span>
          </div>
          <ComponentPalette />
          <div className="display">Display:{setupDisplayList}</div>
        </div>

        <div className="setup2"></div>

        {/* any styles inside graph needs to be either included in the template.js or inline */}
        <div className="graph js-graph">
          <header className="header">
            <div className="headline" ref="headline"></div>
            <div className="standfirst" ref="standfirst"></div>
          </header>
          {chartComponent}
          <footer>
            Guardian Graphic
            <span ref="source"></span>
          </footer>
        </div>
        {/* end of graph */}

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
