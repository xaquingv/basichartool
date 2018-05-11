import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css'
import {colors, metaKeys, chartNames} from '../data/config'
import {selectChart, setColors, setDisplay} from '../actions'
import {chartList} from './charts'


const STEP = 3
const instruction = "Click on a visualization for editing."
const messageError = `
  Oh, oh, something goes wrong! You could:
  1. Double check your dataset,
  2. Contact the Guardian's visual team, or
  3. Email your complaints to apple[dot]cjcfardel[at]yahoo[dot]com.
  `

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
    if (step === 2) {
      setDefaultColors(colors)
    }
    // setup1 display controls
    if (step === 3) {
      const display = {}
      metaKeys.forEach(key => {
        display[key] = (key === "standfirst" && !dataMeta[key]) ? false : true
      })
      setDefaultDisplay(display)
    }
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
          <ComponentChart id={chartID} callByStep={STEP} />{chartNames[chartID]}
        </div>
      )
      : null
    })

    return (
      <div className={"section" + ((stepActive>=STEP)?"":" d-n")} id="section3">
        <h1>3. Select a visualization</h1>
        <p className="instruction">
          Instruction: {selection.length > 0 ? instruction : messageError}
        </p>
        <div className="charts">
          {selection.length > 0 ? chartComponents : "There is NO RESULT!!"}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)
