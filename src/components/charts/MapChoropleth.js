import React from 'react'
import {connect} from 'react-redux'
import {drawMap} from './map'
import getParsedData from './mapData'
import {d3} from '../../lib/d3-lite'


const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Map extends React.Component {

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return (
      <svg ref="svg">
        <g ref="countries"></g>
        <g ref="borders"></g>
        <g ref="lakes"></g>
      </svg>
    )
  }

  renderChart() {

    /* data */
    const dataChart = getParsedData(this.props.dataChart)

    /* draw */
    const els = this.refs

    if (dataChart) {
      drawMap(els)

      d3.select("#mapChoropleth")
      .classed("d-n", false)

      d3.select(els.countries)
      .selectAll("path")
      .attr("fill", (d) => {
        let val = dataChart.data[d.properties[dataChart.type]]
        let color = val ? dataChart.scaleColor(val) : "#dcdcdc" //n-4
        //console.log(color, dataChart.color.indexOf(dataChart.color1(val)), d.properties.code, val, d.properties.name)
        return color
      })

    } else {
      d3.select("#mapChoropleth")
      .classed("d-n", true)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
