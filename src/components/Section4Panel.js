import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import {d3} from '../lib/d3-lite'
import scrollTo from '../lib/scrollTo'
import {metaKeys, default_metaText} from '../data/config'

import ComponentSize    from './section4Panel/Size'
import ComponentLegend  from './section4Panel/Legend'
import ComponentPalette from './section4Panel/Palette'
import ComponentDisplay from './section4Panel/Display'
import {chartList} from './charts'


const STEP = 4;

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  chartId: state.chartId,
  dataMeta: state.dataTable.meta,
  dataSetup: state.dataSetup
});

const mapDispatchToProps = (dispatch) => ({
});


class Section extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.step === STEP
  }

  componentDidUpdate() {

    // set meta values and display
    const metaData = this.props.dataMeta
    const display = this.props.dataSetup.display
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

    const {stepActive, chartId/*, dataSetup*/} = this.props;
    //console.log(dataSetup)

    // TODO: responsive width
    const ComponentChart = chartList[chartId]
    const chartComponent = ComponentChart
    ? (
      <div data-id={chartId} id={chartId+"_edit"} className="chart-edit js-chart">
        <ComponentLegend />
        <ComponentChart id={chartId+"_edit"} callByStep={STEP} width={300} />
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
