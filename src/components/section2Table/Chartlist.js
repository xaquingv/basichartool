import React from 'react'
import { connect } from 'react-redux'
import '../section3Chart.css'
import { chartNames } from '../../data/config'
import { selectChart } from '../../actions'
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
  onSelect: (chartId) => dispatch(selectChart(chartId))
})


class Chartlist extends React.Component {

  render() {
    const { selection, dataChart, onSelect } = this.props
    if (!selection) { return null; }

    // TODO: loop through arr, see charts.js
    // list of charts
    console.log(selection)
    const chartComponents = Object.keys(chartList).map(chartID => {
      const isSelected = selection.indexOf(chartID) > -1
      const ComponentChart = chartList[chartID]

      return isSelected
        ? (
          <div key={chartID} id={chartID} onClick={() => onSelect(chartID)}>
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
