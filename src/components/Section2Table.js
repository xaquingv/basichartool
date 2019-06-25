import React from 'react';
import { connect } from 'react-redux';
import './section2Table.css';
import { /*analyzeData,*/ toggleData, transposeData, setColors, setDisplay } from '../actions';
import { colors, metaKeys } from '../data/config';
import summarizeData from '../data/summarizeData';
import selectCharts from '../data/selectCharts';
import ComponentChartlist from './section2Table/Chartlist';
import ComponentQuestions from './section2Table/Questions';

const STEP = 2;
const instruction = "Toggle a col/row's header to select and deselect data, or transpose this dataset with a click on T."

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  show: state.show,
  dataTable: state.dataTable,
  dataChart: state.dataChart,
  dataMeta: state.dataTable.meta
})

const mapDispatchToProps = (dispatch) => ({
  onTranspose: () => dispatch(transposeData()),
  onToggle: (i, type) => dispatch(toggleData({ type, index: i })),
  // onClickCreate: (dataTable, show) => dispatch(analyzeData(dataTable, show)),
  setDefaultColors: (colors) => dispatch(setColors(colors)),
  setDefaultDisplay: (display) => dispatch(setDisplay(display))
  // TODO:
  // onChangeFormat: () => {}
})


class Section extends React.Component {

  componentDidMount() {
    this.colors = null;
  }
  componentDidUpdate() {
    const { stepActive, dataMeta, setDefaultDisplay } = this.props;
    // setup1 display controls
    if (stepActive > 1) {
      const display = {};
      metaKeys.forEach(key => {
        display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true;
      })
      setDefaultDisplay(display);
    }
  }

  render() {
    const { stepActive, dataTable, show, onToggle, onTranspose, setDefaultColors/*, ... */ } = this.props;
    const isData = dataTable.body ? true : false;
    const dataTypes = isData ? dataTable.type : [];
    const tableHead = isData ? dataTable.head : [];
    const tableBody = isData ? dataTable.body : [];

    // setup1 palette colors
    if (!this.colors) {
      this.colors = colors;
      setDefaultColors(this.colors);
    }
    // get dataChart
    if (stepActive === 2) {
      const summary = summarizeData(dataTable, show);
      this.selection = selectCharts(summary);
      this.dataChart = summary.chart;
    }
    
    return (
      <div className={"section" + ((stepActive >= STEP) ? "" : " d-n")} id="section2">
        <h1>2. Discover your dataset</h1>
        <p className="instruction">Instruction: {instruction}</p>
        <div className={"d-f" + (isData ? "" : " o-0")}>

          {/* table */}
          <div className="section2-table">
            <table>
              <thead>
                <tr>
                  <th onClick={onTranspose}>T</th>
                  {tableHead.map((head, j) =>
                    <th key={"lab-" + j} onClick={() => onToggle(j, "col")} className={"c-p" + (show.col[j] ? '' : ' col-hide')}>{head}</th>
                  )}
                </tr>
                <tr>
                  <th></th>
                  {dataTypes.map((type, j) =>
                    <th key={"key-" + j} className={type.list[0] + " fw-n ws-n" + (show.col[j] ? '' : ' col-hide')}>
                      {/*<span contentEditable={true}>*/}
                      {/* how about use text input ? */}
                      {type.list[0].toUpperCase() +
                        (type.format ? " : " + type.format : "")}
                      {/*</span>*/}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableBody.map((tr, i) =>
                  <tr key={"row-" + i} className={show.row[i] ? '' : 'row-hide'}>
                    <td onClick={() => onToggle(i, "row")} className="c-p">{i + 1}</td>
                    {(tr).map((td, j) =>
                      <td key={"col-" + j} className={dataTypes[j].list[0] + (!td ? " null" : "") + " ws-n" + (show.col[j] ? '' : ' col-hide')}>
                        {td ? td : "null"}
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* charts */}
          <div className="section2-chart">
            <ComponentChartlist selection={this.selection} dataChart={this.dataChart} /> 
          </div>
        </div>
        
        {/* questions */}
        <ComponentQuestions dataChart={this.dataChart} />

        {/* button * /}
        <input
          type="button"
          className={"button btn-create"}
          value="Next"
          onClick={() => onClickCreate(dataTable, show)}
        />*/}

        {/* test hidden ground */}
        <span className="test ff-data js-test-x"></span>
        <span className="test ff-ss js-test-y"></span>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
