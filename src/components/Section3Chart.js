import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css'
import {chartList} from './charts'
import {selectChart} from '../actions'
import scrollTo from '../lib/scrollTo'

const STEP = 3

const mapDispatchToProps = (dispatch) => ({
  onSelect: (chartId) => {
    dispatch(selectChart(chartId))

    // TODO: replace with 1. dispatch scrollSteps
    // to let Navigation.js take care of it ...
    // or attach a scroll event ... 
    const to = document.querySelector("#section4").offsetTop - 80;
    scrollTo(to, null, 1000);
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
      const cnDisplay = isSelected ? "" : "d-n"
      const ComponentChart = chartList[chartID]

      return (
        <div key={chartID} id={chartID} className={cnDisplay} onClick={() => onSelect(chartID)}>
          <ComponentChart id={chartID} stepCall={STEP} isSelected={isSelected} />{chartID}
        </div>
      )
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
