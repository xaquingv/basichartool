import React from 'react';
import {connect} from 'react-redux';
import './section4Panel.css'
import {chartList} from './charts'
import {d3} from '../lib/d3-lite'

const STEP = 4;

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  chartId: state.chartId,
  dataMeta: state.dataTable.meta
});


class Section extends React.Component {

  componentDidUpdate() {
    const meta = this.props.dataMeta
    Object.keys(meta).forEach(key => {
      const text = (key === "source" ? " | Source: " : "") + meta[key]
      d3.select(this.refs[key]).text(text)
    })
    console.log(meta)
  }

  render() {

    const {stepActive, chartId} = this.props;
    /*if (chartId) {
      //console.log("===")
      console.log(this.props.chartId || "NaN", "is selected")
    }*/

    // TODO: responsive width
    const ComponentChart = chartList[chartId]
    const chartComponent = ComponentChart
    ? (
      <div data-id={chartId} id={chartId+"_edit"} className="chart-edit js-chart">
        <ComponentChart id={chartId+"_edit"} callByStep={STEP} width={320} />
      </div>
    )
    : null

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section4">
        <h1>4. Edit your graph</h1>
        <div className="setup1"></div>
        <div className="setup2"></div>
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
