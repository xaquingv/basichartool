import React from 'react'
import { connect } from 'react-redux'
import { dropColorTo, dropColorLineTo } from '../../actions'
import { colors } from '../../data/config';
import ComponentEditor from './Editor'


const mapStateToProps = (state) => ({
  id: state.chartId,
  dataSetup: state.dataSetup,
  legend: state.dataChart.legend,
  dataChart: state.dataChart,
  highlights: state.lineHighlights
})

const mapDispatchToProps = (dispatch) => ({
  onDropColor: (i) => dispatch(dropColorTo(i)),
  onDropColorLine: (i, highlights) => dispatch(dropColorLineTo(i, highlights))
})


class Legend extends React.Component {

  render() {
    const { id, dataChart, dataSetup, onDropColor, onDropColorLine, isBarBased, highlights } = this.props
    const { legend, string1Width } = dataChart

    const length = legend.length
    const colorLines = dataSetup.colorLines
    const display = dataSetup.display.legend

    const chartWidth = dataSetup.size.w || 300
    const labelWidth = string1Width
    const marginLeft = isBarBased && !id.includes("broken") && (labelWidth <= chartWidth / 3) ? labelWidth : 0
    const isLine = id.includes("line")

    let drawLegend = null

    const handleDoubleClick = (i, label) => {
      let index = highlights.findIndex(h => h.key === i)
      
      // add new line to highlights if line
      if (index === -1) {
        let newHighlights = [...highlights]
        newHighlights.push({key: i, txt: label})
        onDropColorLine(i, newHighlights)
      // update line color
      } else if (isLine) {
        onDropColorLine(i, highlights)
      // update color but line's
      } else {
        onDropColor(i)
      }
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
            style={{ backgroundColor: isLine ? (colorLines[i] ? colorLines[i] : colors[6]) : dataSetup.colors[i] }}
            onDoubleClick={() => handleDoubleClick(i, label)}>
          </span>
          <span className="legend-label">
            <ComponentEditor text={label} />
          </span>
        </div>
      )
    }

    return (
      <div className={"legend" + (display ? "" : " d-n")} /*style={{ marginLeft: marginLeft }}*/>{drawLegend}</div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend)
