import React from 'react'
import { connect } from 'react-redux'
import './chartlist.css'
import { chartNames } from '../../data/config'
import { selectChart, setSelectionInOrder } from '../../actions'
import { chartList } from '../charts'


const STEP = 2;

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  dataChart: state.dataChart,
  selection: state.selection
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (chartId) => dispatch(selectChart(chartId)),
  setDataSelectionInOrder: (selectionInOrder) => dispatch(setSelectionInOrder(selectionInOrder))
})


class Chartlist extends React.PureComponent {
  componentDidUpdate() {
    // selectionInOrder: filter out hidden chart(s), and 
    // in case of no charts available, as warning msg take a <div> as well: el.id!==""
    const selectionInOrder = this.props.stepActive < 2 ?
      [] :
      [...document.querySelectorAll(".charts > div")]
        .filter(el => !el.getAttribute("class").includes("d-n") && el.id !== "")
        .map(el => el.id)

    this.props.setDataSelectionInOrder(selectionInOrder)
  }

  render() {
    console.log("render step 2: charts", this.props.selection)
    const { selection, dataChart } = this.props
    if (!selection) { return null; }

    // TODO: loop through arr, see charts.js
    // list of charts
    let selectCount = 0
    const chartComponents = Object.keys(chartList).map((chartID, index) => {
      const isSelected = selection.indexOf(chartID) > -1
      const ComponentChart = chartList[chartID]

      if (isSelected) selectCount++;
      return isSelected
        ? (
          // <div key={chartID} id={chartID} onClick={() => onSelect(chartID)}>
          <div key={chartID} id={chartID} className={selectCount !== 1 ? "order2" : "order1"}>
            <ComponentChart id={chartID} callByStep={STEP} dataChart={dataChart} />{chartNames[chartID]}
          </div>
        )
        : null
    })

    return (
      <div id="chartlist">
        <div className="charts">
          {selection.length > 0 ? chartComponents : <div className="warning">There is NO RESULT!!</div>}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chartlist)
