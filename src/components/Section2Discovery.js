import React from 'react';
import { connect } from 'react-redux';
// import './section2Discovery.css';
import { toggleData, transposeData, setColors, setDisplay } from '../actions';
import { colors, metaKeys } from '../data/config';
import ComponentTable from './section2Discovery/Table'
import ComponentChartlist from './section2Discovery/Chartlist';
import ComponentQuestions from './section2Discovery/Questions';

const STEP = 2;
const instruction = "Toggle a col/row's header to select and deselect data, or transpose this dataset with a click on T."

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  dataMeta: state.dataTable.meta,
})

const mapDispatchToProps = (dispatch) => ({
  onTranspose: (dataTable, show) => dispatch(transposeData(dataTable, show)),
  onToggle: (dataTable, show, i, type) => dispatch(toggleData(dataTable, show, { type, index: i })),
  setDefaultColors: (colors) => dispatch(setColors(colors)),
  setDefaultDisplay: (display) => dispatch(setDisplay(display))
  // TODO:
  // onChangeFormat: () => {}
})


class Section extends React.Component {
  componentDidMount() {
    this.colors = null;
    this.metaKeys = null;
  }

  render() {
    // TODO: move to ...
    /* setup1: palette colors and display controls */
    const { stepActive, dataMeta, setDefaultColors, setDefaultDisplay } = this.props;
    if (stepActive === 2 && !this.colors) {
      this.colors = colors;
      setDefaultColors(this.colors);
    }
    if (stepActive === 3 && !this.metaKeys) {
      this.metaKeys = metaKeys;
      const display = {};
      metaKeys.forEach(key => {
        display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true;
      })
      setDefaultDisplay(display);
    } 
    /* end of setup1 */

    const isRender = stepActive >= STEP;

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

        {/* submit button */}
        {/* <input
          type="button"
          className={"button btn-create"}
          value="Next"
          // onClick={() => onClickCreate(dataTable, show)}
        /> */}

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
