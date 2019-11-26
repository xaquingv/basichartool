import React from 'react'
import { connect } from 'react-redux'
import './chartlist.css'
import { chartNames } from '../../data/config'
import { selectChart, removeChartDuplicate } from '../../actions'
import { chartComponents } from '../charts'


const STEP = 2;
const MSG_WARNING = "There is NO RESULT!!"

const mapStateToProps = state => ({
  chartIdFirst: state.chartId,
  selection: state.selection,
  isInit: state.dataChart.isInit
})

const mapDispatchToProps = dispatch => ({
  onSelect: chartId => dispatch(selectChart(chartId)),
  removeSelectionChartDuplicate: (selection, removeId) => dispatch(removeChartDuplicate(selection, removeId))
})


class Chartlist extends React.PureComponent {
  componentDidUpdate() {
    const selection = this.props.selection
    if (selection && (selection.indexOf("lineDiscrete") > -1 && selection.indexOf("lineContinue") > -1)) {
      // check if discrete and conti are the same
      // if the same (duplicate), remove the discrete line from the selection list
      const pathDiscrete = document.querySelector("#lineDiscrete path")
      const pathContinue = document.querySelector("#lineContinue path")
      if (pathDiscrete && pathContinue && pathDiscrete.getAttribute("d") === pathContinue.getAttribute("d")) {
        this.props.removeSelectionChartDuplicate(selection, "lineDiscrete")
      }
    }
  }

  render() {
    const { selection, chartIdFirst, isInit } = this.props
    
    // require a selection of charts to generate chartList
    if (!selection) { return null; }
    // console.log("render step 2: charts", this.props.selection)

    // case1/2: list of charts in selection
    const chartComponentsInSelection = Object.keys(chartComponents).map((chartId) => {
      if (selection.indexOf(chartId) > -1) {
        const ComponentChart = chartComponents[chartId]
        const isFirstChart = (chartId === chartIdFirst)
        const isSelected = isFirstChart && isInit
        if(isSelected) console.log("append data")
        return (
          <div key={chartId} id={chartId} className={isFirstChart ? "order1" : "order2"}>
            <ComponentChart id={chartId} callByStep={STEP} isSelected={isSelected} />
            {chartNames[chartId]}
          </div>
        )
      } else {
        return null
      }
    })
    
    // case2/2: no chart in selection
    const warningMessage = <div className="warning">{MSG_WARNING}</div>

    return (
      <div id="chartlist">
        <div className="charts">{selection.length > 0 ? 
          chartComponentsInSelection : 
          warningMessage
        }</div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chartlist)
