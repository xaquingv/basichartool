import React from 'react';
import {connect} from 'react-redux';
import {chartList} from './charts'

const STEP = 4;

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  chartId: state.chartId,
  dataMeta: state.dataTable.meta
});


class Section extends React.Component {

  render() {

    const {stepActive, chartId} = this.props;
    /*if (chartId) {
      //console.log("===")
      console.log(this.props.chartId || "NaN", "is selected")
    }*/

    const ComponentChart = chartList[chartId] || ""
    const chartComponent = (
      <div data-id={chartId} id={chartId+"_edit"}>
        <ComponentChart id={chartId+"_edit"} stepCall={STEP} isSelected={true} isUpdate={true}/>
      </div>
    )

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section4">
        <h1>4. Edit your graph</h1>
        <div className="setup1"></div>
        <div className="setup2"></div>
        <div className="graph">
          <header className="header">
            <div className="js-headline"></div>
            <div className="js-standfirst"></div>
          </header>
          {chartId ? chartComponent : null}
          <footer className="js-source"></footer>
        </div>
      </div>
    );
  }

  forceUpdate(){}
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
