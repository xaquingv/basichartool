import React from 'react'
import { connect } from 'react-redux'
import './table.css'
import { toggleData, transposeData } from '../../actions';


const mapStateToProps = state => ({
  show: state.show,
  dataTable: state.dataTable,
})

const mapDispatchToProps = dispatch => ({
  onTranspose: (dataTable, show) => dispatch(transposeData(dataTable, show)),
  onToggle: (dataTable, show, i, type) => dispatch(toggleData(dataTable, show, { type, index: i })),
})


class Table extends React.PureComponent {

  render() {
    const { dataTable, show, onToggle, onTranspose } = this.props;
    const dataTypes = dataTable.type;
    
    // require dataTable to generate the table
    if (!dataTypes) { return null; }
    // console.log("render step 2: table")

    return (
      <div id="table">
        <table>
          <thead>
            <tr>
              <th onClick={() => onTranspose(dataTable, show)}>T</th>
              {dataTable.head.map((head, j) =>
                <th key={"lab-" + j} onClick={() => onToggle(dataTable, show, j, "col")} className={"c-p" + (show.col[j] ? '' : ' col-hide')}>{head}</th>
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
            {dataTable.body.map((tr, i) =>
              <tr key={"row-" + i} className={show.row[i] ? '' : 'row-hide'}>
                <td onClick={() => onToggle(dataTable, show, i, "row")} className="c-p">{i + 1}</td>
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)