import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css'
import {colors, metaKeys} from '../data/config'
import {selectChart, setColors, setDisplay} from '../actions'
import {chartList} from './charts'


const STEP = 3

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  selection: state.selection,
  dataMeta: state.dataTable.meta
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (chartId) => dispatch(selectChart(chartId)),
  setDefaultColors: (colors) => dispatch(setColors(colors)),
  setDefaultDisplay: (display) => dispatch(setDisplay(display)),
})


class Section extends React.Component {

  componentWillUpdate() {
    // TODO: check if set bf step 3?
    const {step, dataMeta, setDefaultColors, setDefaultDisplay} = this.props

    // setup1 palette colors
    setDefaultColors(colors)

    // setup1 display controls
    if (step < 3) return
    const display = {}
    metaKeys.forEach(key => {
      display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true
    })
    setDefaultDisplay(display)
  }

  render() {
    const {stepActive, selection, onSelect} = this.props

    // TODO: loop through arr, see charts.js
    // list of charts
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
