import React from 'react'
import { connect } from 'react-redux'
import '../section3Chart.css'
import { chartNames } from '../../data/config'
import { selectChart, setSelectionInOrder } from '../../actions'
import { chartList } from '../charts'


const STEP = 2;
/*
const instruction = "Click on a visualization for editing."
const messageError = `
  Oh, oh, something goes wrong! You could:
  1. Double check your dataset,
  2. Contact the Guardian's visual team, or
  3. Email your complaints to apple[dot]cjcfardel[at]yahoo[dot]com.
  `
 */

const mapStateToProps = (state) => ({
  step: state.step,
  dataMeta: state.dataTable.meta
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (chartId) => dispatch(selectChart(chartId)),
  setDataSelectionInOrder: (selectionInOrder) => dispatch(setSelectionInOrder(selectionInOrder)) 
})


class Chartlist extends React.Component {
  componentDidUpdate() {
    const selectionInOrder = [...document.querySelectorAll(".charts > div")].filter(el => !el.getAttribute("class").includes("d-n")).map(el => el.id)
    this.props.setDataSelectionInOrder(selectionInOrder)
  }

  render() {
    const { selection, dataChart/*, onSelect*/ } = this.props
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
          <div key={chartID} id={chartID} className={selectCount!==1 ? "order2" : "order1"}>
            <ComponentChart id={chartID} callByStep={STEP} dataChart={dataChart} />{chartNames[chartID]}
          </div>
        )
        : null
    })

    return (
      <div className="charts">
        {selection.length > 0 ? chartComponents : <div className="warning">There is NO RESULT!!</div>}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chartlist)
