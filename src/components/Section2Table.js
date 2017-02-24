import React from 'react'
import {connect} from 'react-redux'
import './section2Table.css'
import {analyzeData, toggleData, transposeData} from '../actions'


const STEP = 2;

const mapStateToProps = (state) => ({
    //step: state.step,
    stepActive: state.stepActive,
    dataTable: state.dataTable,
    show: state.show
})

const mapDispatchToProps = (dispatch) => ({
  onTranspose:   ()                => dispatch(transposeData()),
  onToggle:      (i, type)         => dispatch(toggleData({type, index: i})),
  onClickCreate: (dataTable, show) => dispatch(analyzeData(dataTable, show)),
  // TODO:
  // onChangeFormat: () => {}
})


class Section extends React.Component {

    render() {
        const {/*step,*/ stepActive, dataTable, show, onClickCreate, onToggle, onTranspose/*, ... */} = this.props;
        const isData = dataTable.body ? true : false;
        const dataTypes = isData ? dataTable.type : [];
        const tableHead = isData ? dataTable.head : [];
        const tableBody = isData ? dataTable.body : [];

        return (
            <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section2">
                <h1>2. Toggle your dataset</h1>
                <div className={isData?"":" o-0"}>

                {/* table */}
                <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th onClick={onTranspose}>T</th>
                      {tableHead.map((head, j) =>
                      <th key={"lab-"+j} onClick={()=>onToggle(j, "col")} className={"c-p" + (show.col[j] ? '' : ' col-hide')}>{head}</th>
                      )}
                    </tr>
                    <tr>
                      <th></th>
                      {dataTypes.map((type, j) =>
                      <th key={"key-"+j} className={type.list[0] + " fw-n ws-n" + (show.col[j] ? '' : ' col-hide')}>
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
                      <tr key={"row-"+i} className={show.row[i] ? '' : 'row-hide'}>
                        <td onClick={()=>onToggle(i, "row")} className="c-p">{i+1}</td>
                        {(tr).map((td, j) =>
                        <td key={"col-"+j} className={dataTypes[j].list[0] + (!td ? " null" : "") + " ws-n" + (show.col[j] ? '' : ' col-hide')}>
                          {td ? td : "null"}
                        </td>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>

                {/* button */}
                <input
                  type="button"
                  className={"button btn-create"}
                  value="Create Visualizations"
                  onClick={() => onClickCreate(dataTable, show)}
                />
                </div>

                {/* test hidden ground */}
                <span className="test ff-data js-test-x"></span>
                <span className="test ff-ss js-test-y"></span>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
