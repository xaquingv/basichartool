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

const mapStateToProps = (state) => ({
  dataChart: state.dataBrief
})

const mapDispatchToProps = (dispatch) => ({
})


class Bar extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.flag
  }

  componentDidUpdate(){

    /* data */
    const dataCols = this.props.dataChart.cols
    const dataType = dataCols.map(d => d.type)

    const dataGroup = dataCols[dataType.indexOf("string")].values
    const dataNumbers = dataCols[dataType.indexOf("number")].values

    /* validate 2 */
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
    //console.log(dataChart)


    /* draw */
    const els = this.refs
    drawPlot(els, dataChart, {colors: ["#4dc6dd", "#f6f6f6"]})
  }


  render() {
    return (
      <div className="chart" ref="div"></div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bar)
