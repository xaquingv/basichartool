import React from 'react'
import { connect } from 'react-redux'
import { dropColorTo } from '../../actions'
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  dataSetup: state.dataSetup,
  legend: state.dataChart.legend,
  dataChart: state.dataChart,
  highlights: state.lineHighlights
})

const mapDispatchToProps = (dispatch) => ({
  onDropColor: (i, highlights) => dispatch(dropColorTo(i, highlights))
})


class Legend extends React.Component {

  render() {
    const { id, dataChart, dataSetup, onDropColor, isBarBased, highlights } = this.props
    const { legend, string1Width } = dataChart

    const length = legend.length
    const colors = dataSetup.colors
    const display = dataSetup.display.legend

    const chartWidth = dataSetup.size.w || 300
    const labelWidth = string1Width
    const marginLeft = isBarBased && !id.includes("broken") && (labelWidth <= chartWidth / 3) ? labelWidth : 0

    let drawLegend = null

    const handleDoubleClick = (i, label) => {
      let newHighlights = [...highlights]
      let index = newHighlights.findIndex(h => h.key === i)
      // add new line to highlights
      if (index === -1) newHighlights.push({key: i, txt: label})
      
      onDropColor(i, newHighlights)
    }

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
            style={{ backgroundColor: colors[i] }}
            onDoubleClick={() => handleDoubleClick(i, label)}>
          </span>
          <span className="legend-label">
            <ComponentEditor text={label} />
          </span>
        </div>
      )
    }

    return (
      <div className={"legend" + (display ? "" : " d-n")} style={{ marginLeft: marginLeft }}>{drawLegend}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
