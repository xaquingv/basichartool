import React from 'react';
import {connect} from 'react-redux';
import './Section2Table.css';
import {nextStep, activeStep} from '../actions';
//import scrollTo from '../lib/scrollTo';


const STEP = 2;
const mapDispatchToProps = (dispatch) => ({
  onClickCreate: () => {
    dispatch(nextStep(STEP));
    dispatch(activeStep(STEP));
  },
  //onChangeContent: () => null,
});

const mapStateToProps = (state) => ({
    data: state.data,
    stepActive: state.stepActive
});


class Section extends React.Component {

    render() {
        const {data, stepActive, onClickCreate/*, onChangeContent*/} = this.props;
        const tableData = data.rows || [];
        const isData = tableData.length > 0;
        const dataTypes = isData ? ["T"].concat(tableData[0].map(()=>"type?")):[]; //temp
        //console.log("table:", tableData);
        
        return (
            <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section2">
                <h1>2. Toggle your dataset</h1>
                <div className={isData?"":" o-0"}>
                {/*
                  toggles
                  ...
                */}

                {/* table */}
                <div className="table">
                <table>
                  <thead>
                    <tr>{dataTypes.map((type, i) =>
                      <th key={"key-"+i}>{type}</th>
                    )}</tr>
                  </thead>
                  <tbody>
                    {tableData.map((tr, i) =>
                      <tr key={"row-"+i}>{[i].concat(tr).map((td, j) =>
                        <td
                          key={"col-"+j}
                          /*contentEditable={"true"}
                          onChange={onChangeContent}*/>{td}
                        </td>)}
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
                  onClick={() => onClickCreate()}
                />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
