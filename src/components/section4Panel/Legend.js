import React from 'react'
import {connect} from 'react-redux'
import {dropColorTo} from '../../actions'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  dataSetup: state.dataSetup,
  legend: state.dataChart.legend,
  dataChart: state.dataChart
})

const mapDispatchToProps = (dispatch) => ({
  onDropColor: (i) => dispatch(dropColorTo(i))
})


class Legend extends React.Component {

  render() {
    const {dataChart, dataSetup, onDropColor, isBarBased} = this.props
    const {legend, string1Width} = dataChart

    const length = legend.length
    const colors = dataSetup.colors
    const display = dataSetup.display.legend

    const chartWidth = dataSetup.size.w || 300
    const labelWidth = string1Width
    const marginLeft = isBarBased && (labelWidth <= chartWidth/3) ? labelWidth : 0

    let drawLegend = null

    // case: no color keys
    if (length === 1) {
      drawLegend = <ComponentEditor text={legend[0]} />
      //<span>{legend}</span>
    }
    // case: with color keys
    else if (length > 1) {
      drawLegend = legend.map((label, i) =>
        <div className="legend-item" key={i}>
          <span className="legend-color"
            style={{backgroundColor: colors[i]}}
            onClick={()=>onDropColor(i)}>
          </span>
          <span className="legend-label">
            <ComponentEditor text={label} />
          </span>
        </div>
      )
    }

    return (
      <div className={"legend" + (display ? "" : " d-n")} style={{marginLeft: marginLeft}}>{drawLegend}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
