import React from 'react';
import { connect } from 'react-redux';
import { toggleData, transposeData, initSetup } from '../actions';
import { colors, metaKeys } from '../data/config';
import ComponentTable from './section2Discovery/Table'
import ComponentChartlist from './section2Discovery/Chartlist';
import ComponentQuestions from './section2Discovery/Questions';

const STEP = 2;
const instruction = "Toggle a col/row's header to select and deselect data, or transpose this dataset with a click on T."

const mapStateToProps = state => ({
  stepActive: state.stepActive,
  dataMeta: state.dataTable.meta,
  dataSentence: state.dataSentence,
  dataChart: state.dataChart
})

const mapDispatchToProps = dispatch => ({
  onTranspose: (dataTable, show) => dispatch(transposeData(dataTable, show)),
  onToggle: (dataTable, show, i, type) => dispatch(toggleData(dataTable, show, { type, index: i })),
  setDefaultSetup: (colors, display) => dispatch(initSetup(colors, display)),
  // setDefaultDisplay: display => dispatch(setDisplay(display))
  // TODO:
  // onChangeFormat: () => {}
})


class Section extends React.Component {
  componentDidMount() {
    this.colors = null;
    this.metaKeys = null;
  }

  componentDidUpdate() {
    const { stepActive, dataMeta, dataChart, setDefaultSetup, dataSentence } = this.props;
    // console.log("render step 2: did update", dataChart)

    // TODO: use isImport or isClear to update display
    /* setup1: palette colors and display controls (on/off) of meta info (headline, standfirst, ...) */
    // note that once there is a change in dataTable, dataSentence will be set to null
    // thus it's used to see if dataSetup needs to be (re-)init 
    if (stepActive === 2 && !dataSentence) {
      const numberCols = dataChart.numberCols;
      const displaySwitches = {};

      // palette colors
      // line > 10, only color the first line as highlight, keep others lightgrey
      this.colors = numberCols.length > 10 ?
        numberCols.map((col, idx) => idx === 0 ? colors[0] : colors[6]) :
        colors

      // display controls
      this.metaKeys = metaKeys;
      metaKeys.forEach(key => {
        displaySwitches[key] = (key === "standfirst" && !dataMeta[key]) ? false : true;
      })

      setDefaultSetup(this.colors, displaySwitches)
    }
  }

  render() {
    const isRender = this.props.stepActive >= STEP;
    // console.log("render step 2")

    return (
      <div className={"section" + (isRender ? "" : " d-n")} id="section2">
        <h1>2. Discover your dataset</h1>
        <p className="instruction">Instruction: {instruction}</p>

        <div className={"d-f"}>
          <div style={{ width: "calc(100% - 318px)" }}>
            <ComponentTable />
            <ComponentQuestions />
          </div>
          <ComponentChartlist />
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
