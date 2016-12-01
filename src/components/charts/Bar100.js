import React from 'react'
import {connect} from 'react-redux'
import {d3} from '../../lib/d3-lite'
import {drawPlot} from './bar'

/*
  data spec
  no missing data
  cols [4, many]
  - date: no-repeat
  - number*: all positive, min 3
  PS. col sums 100(%) !?
*/


const mapDispatchToProps = (dispatch) => ({
})

const mapStateToProps = (state) => ({
  step: state.step,
  stepActive: state.stepActive,
  dataChart: state.dataBrief
})


class Bar extends React.Component {
  componentDidUpdate(){
    console.log("bar100", this.props.step)
    if (this.props.step !== 3) return


    // TODO: move to section 3
    /* validate */
    const els = this.refs

    const count = this.props.dataChart.count
    if (count.col === 2 && count.string === 1 && count.number === 1 && count.date === 0) {
      d3.select("#bar100")
      .classed("d-n", false)
    } else {
      d3.select("#bar100")
      .classed("d-n", true)
      return
    }


    /* data */
    const dataCols = this.props.dataChart.cols
    const dataType = dataCols.map(d => d.type)

    const dataGroup = dataCols[dataType.indexOf("string")].values
    const dataNumbers = dataCols[dataType.indexOf("number")].values

    /* validate 2 */
    const isAllPositive = dataNumbers.filter(num => num < 0).length === 0
    if (!isAllPositive) {
      d3.select("#bar100")
      .classed("d-n", true)
      return
    }
    // is100
    const isAllSmallerThan100 = dataNumbers.filter(num => num <= 100).length === dataNumbers.length
    const domainMax = isAllSmallerThan100 ? 100 : Math.max.apply(null, [].concat.apply([], dataNumbers))

    const scaleX = d3.scaleLinear()
    .domain([0, domainMax])
    .range([0, 100])

    const dataChart = dataGroup.map((group, i) => {
      const num = dataNumbers[i]
      return {
        group: group,
        value: [{
          title: num,
          width: scaleX(num)
        }].concat([{
          title: "",
          width: 100 - scaleX(num)
        }])
      }
    })
    console.log(dataChart)


    /* draw */
    //const scaleY = (count) => Math.round((((24 - (count-1)) / 3) * 2) / count)
    //const barHeight = scaleY(count.number)

    drawPlot(els, dataChart, {colors: ["#4dc6dd", "#f6f6f6"]})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
