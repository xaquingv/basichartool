import React from 'react'
import {connect} from 'react-redux'
import {drawMap, path, featureCountries} from './map'
import getParsedData from './mapData'
import {d3} from '../../lib/d3-lite'

/*
  data spec
  missing data accepted
  cols [2, 5]
  rows []
  - string: country code and/or name  => mapping
  - number: any range                 => bubble radius or seq color
  - number (optional): any range      => bubble radius or seq color
  - string (optional): ordinal        => div color
*/

const rangeRadius = [2, 10]

const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataCols: state.dataTable.cols,
  dataType: state.dataTable.type
})


class Map extends React.Component {
  //componentDidMount
  componentDidUpdate(){
    if (this.props.step !== 3) return

    /* data */
    const dataChart = getParsedData(this.props.dataCols, this.props.dataType)

    /* draw */
    const els = this.refs

    if (dataChart) {
      /* data */
      const dataCountries = featureCountries.map(d => {
        d.val = parseFloat(dataChart.data[d.properties[dataChart.type]])
        return d
      })
      const scaleRadius = d3.scaleSqrt()
      .domain(dataChart.domain)
      .range(rangeRadius)

      // temp
      // sort samll to large to emphasize large numbers
      // ignore null data
      const dataCountriesClean = dataCountries.filter(d => d.val)
      dataCountriesClean.sort((d1, d2) => d1.val - d2.val)

      /* draw */
      const els = this.refs
      drawMap(els)

      d3.select(els.svg)
      .classed("d-n", false)

      d3.select(els.circles)
      .selectAll("circle")
      .data(dataCountriesClean)
      .enter().append("circle")
      .attr("fill-opacity", 0.5)
      .attr("fill", d => d.val ? dataChart.scaleColor(d.val) : "#dcdcdc") //n-4
      .attr("r", d => scaleRadius(d.val))
      .attr("transform", d => "translate(" + path.centroid(d) + ")")

    } else {
      d3.select(els.svg)
      .classed("d-n", true)
    }
  }

  render() {
    return (
      <svg ref="svg">
        <g ref="countries"></g>
        <g ref="borders"></g>
        <g ref="lakes"></g>
        <g ref="circles"></g>
      </svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
