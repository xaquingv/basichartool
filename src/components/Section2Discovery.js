import React from 'react';
import { connect } from 'react-redux';
import { toggleData, transposeData, setDisplay, initSetup } from '../actions';
import { colors, metaKeys } from '../data/config';
import ComponentTable from './section2Discovery/Table'
import ComponentChartlist from './section2Discovery/Chartlist';
import ComponentQuestions from './section2Discovery/Questions';

const STEP = 2;
const instruction = "Toggle a col/row's header to select and deselect data, or transpose this dataset with a click on T."

const mapStateToProps = state => ({
  stepActive: state.stepActive,
  dataMeta: state.dataTable.meta,
  dataSentence: state.dataSentence
})

const mapDispatchToProps = dispatch => ({
  onTranspose: (dataTable, show) => dispatch(transposeData(dataTable, show)),
  onToggle: (dataTable, show, i, type) => dispatch(toggleData(dataTable, show, { type, index: i })),
  setDefaultSetup: (colors, display) => dispatch(initSetup(colors, display)),
  setDefaultDisplay: display => dispatch(setDisplay(display))
  // TODO:
  // onChangeFormat: () => {}
})


class Section extends React.Component {
  componentDidMount() {
    this.colors = null;
    this.metaKeys = null;
  }

  componentDidUpdate() {
    const { stepActive, dataMeta, setDefaultSetup, setDefaultDisplay, dataSentence } = this.props;
    // console.log("render step 2: did update")

    // TODO: use isImport or isClear to update display
    /* setup1: palette colors and display controls */
    if (stepActive === 2 && !this.colors) {
      this.colors = colors;
      // setDefaultColors(this.colors);
      
      this.metaKeys = metaKeys;
      const display = {};
      metaKeys.forEach(key => {
        display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true;
      })
      setDefaultSetup(colors, display)
    }
    if (stepActive === 2 && !dataSentence) {
      this.metaKeys = metaKeys;
      const display = {};
      metaKeys.forEach(key => {
        display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true;
      })
      setDefaultDisplay(display);
    }  
  }

  render() {
    const isRender = this.props.stepActive >= STEP;
    // console.log("render step 2")
    
    return (
      <div className={"section" + (isRender ? "" : " d-n")} id="section2">
        <h1>2. Discover your dataset</h1>
        <p className="instruction">Instruction: {instruction}</p>

        {/* table and charts */}
        <div className={"d-f"}>
          <ComponentTable />
          <ComponentChartlist />
        </div>

        {/* questions */}
        <ComponentQuestions />

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
