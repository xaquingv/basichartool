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

const rangeRadius = [0.5, 10]

const mapStateToProps = (state) => ({
  stepUser: state.step,
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Map extends React.Component {
  /* update controls */
  componentDidMount() {
    if (this.props.isUpdate) this.setState({kickUpdate: true})
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isSelected && nextProps.stepUser === nextProps.stepCall
  }

  componentDidUpdate(){

    /* data */
    const dataChart = getParsedData(this.props.dataChart)

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

      d3.select("#mapBubble")
      .classed("d-n", false)

      d3.select(els.circles)
      .selectAll("circle")
      .data(dataCountriesClean)
      .enter().append("circle")
      //.attr("fill-opacity", 0.5)
      //.attr("fill", d => d.val ? dataChart.scaleColor(d.val) : "#dcdcdc") //n-4
      .attr("fill", "transparent")
      .attr("stroke", "#951c55")
      .attr("r", d => scaleRadius(d.val))
      .attr("transform", d => "translate(" + path.centroid(d) + ")")

    } else {
      d3.select("#mapBubble")
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
