import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'
import drawChart from './area'

const mapStateToProps = state => ({
  data: state.dataChart,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = dispatch => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class Area extends React.Component {
  appendChartData() {
    if (this.props.isSelected) { 
      const { data, onSelect } = this.props
      onSelect(data.keys, this.scale) 
    }
  }

  componentDidMount() {
    this.renderChart()
    this.appendChartData()
  }
  componentDidUpdate() {
    this.appendChartData()
    this.renderChart()
  }

  render() {
    const { data } = this.props

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" 
        style={{
          top: "-1px",
          width: "calc(100% - " + (data.indent) + "px)",
          height: "100%"//data.height + "%"
        }}
      >
        <line ref="line" x1="0" x2="100%" y1="50%" y2="50%"></line>
      </svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors } = this.props
    const { numberRows, numberRowSums } = data
    const dates = data.dateCol
    const domain = [0, 100] // diff vs. AreaStack

    // chart part 1/2
    const dataChartGroup = dates.map((date, i) => ({
        date, 
        ...numberRows[i].map(n => 100 * n/numberRowSums[i]) // diff vs. AreaStack, rescale to 100%
    }))

    let keys = Object.keys(dataChartGroup[0])
    keys.splice(keys.indexOf("date"), 1)
    
    const stack = d3.stack().keys(keys)
    const dataChart = stack(dataChartGroup)
    
    // scale
    const scaleTime = data.dateHasDay ? d3.scaleTime : d3.scaleLinear

    this.scale = {}
    this.scale.x = scaleTime()
      .domain(d3.extent(dates))
      .range([0, width])

    this.scale.y = d3.scaleLinear()
      .domain(domain)
      .range([height, 0])

    // chart part 2/2
    const area = d3.area()
      .x((d, i) => this.scale.x(d.data.date))
      .y0((d) => this.scale.y(d[0]))
      .y1((d) => this.scale.y(d[1]))


    /* draw */
    drawChart(this.refs, dataChart, area, colors)
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Area)
