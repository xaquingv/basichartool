import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {colors} from '../../data/config'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/

const width = 320
const height = width*0.6
const radius = Math.min(width, height) / 2

const mapStateToProps = (state) => ({
  stepUser: state.step,
  dataChart: state.dataBrief.chart
})

const mapDispatchToProps = (dispatch) => ({
})


class Area extends React.Component {
  /* update controls */
  componentDidMount() {
    if (this.props.isUpdate) this.setState({kickUpdate: true})
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isSelected && nextProps.stepUser === nextProps.stepCall
  }

  componentDidUpdate(){

    /* data */
    const data = this.props.dataChart
    const dataChart = data.numbers
    //const ...

    const pie = d3.pie()
    .sort(null)
    .value(d => d)

    const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - radius*2/3)


    /* draw */
    // init area
    let svg = d3.select(this.refs.pie)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("path")
    .data(pie(dataChart))

    // update
    svg
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])

    // new
    svg.enter().insert("path", ":first-child")
    .attr("d", d => arc(d))
    .attr("fill", (d, i) => colors[i])
    .attr("shape-rendering", "auto")

    // remove
    svg.exit().remove()
  }


  render() {
    return (
      <svg ref="svg">
        <g ref="pie"></g>
      </svg>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Area)
