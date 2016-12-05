import React from 'react'
import {connect} from 'react-redux'
import './section3Chart.css';
import {chartList} from './charts'

const STEP = 3

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  //step: state.step,
  stepActive: state.stepActive,
  selection: state.selection
})


class Section extends React.Component {

  render() {
    const {stepActive, selection} = this.props
    //console.log("selected chart list:", selection)

    // TODO: loop through arr, see charts.js
    const chartComponents = Object.keys(chartList).map(chartID => {
      const isSelected = selection.indexOf(chartID) > -1
      const cnDisplay = isSelected ? "" : "d-n"
      const ComponentChart = chartList[chartID]
      return <div key={chartID} id={chartID} className={cnDisplay}><ComponentChart flag={isSelected} id={chartID}/>{chartID}</div>
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
