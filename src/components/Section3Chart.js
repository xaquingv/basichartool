import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css'
import {chartList} from './charts'
import {selectChart} from '../actions'

const STEP = 3

const mapDispatchToProps = (dispatch) => ({
  onSelect: (chartId) => {
    dispatch(selectChart(chartId))
  }
})

const mapStateToProps = (state) => ({
  stepActive: state.stepActive,
  selection: state.selection
})


class Section extends React.Component {

  render() {
    const {stepActive, selection, onSelect} = this.props

    // TODO: loop through arr, see charts.js
    const chartComponents = Object.keys(chartList).map(chartID => {
      const isSelected = selection.indexOf(chartID) > -1
      const ComponentChart = chartList[chartID]

      return isSelected
      ? (
        <div key={chartID} id={chartID} onClick={() => onSelect(chartID)}>
          <ComponentChart id={chartID} callByStep={STEP} width={300}/>{chartID}
        </div>
      )
      : null
    })

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section3">
        <h1>3. Select a visualization</h1>
        <div className="charts">
          {chartComponents}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)
