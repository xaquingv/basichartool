import React from 'react'
import { connect } from 'react-redux'
import { d3 } from '../../lib/d3-lite'
import drawChart from './plot'
import { uniqueArray } from '../../lib/array'
import { appendChartData } from '../../actions'
import { width, height, viewBox } from '../../data/config'

const mapStateToProps = (state, props) => ({
  //data: state.dataChart,
  data: {...props.dataChart, ...state.dataChart},
  axis: state.dataEditable.axis,
  colors: state.dataSetup.colors
})

const mapDispatchToProps = (dispatch) => ({
  onSelect: (keys, scale) => dispatch(appendChartData(keys, scale))
})


class ScatterPlot extends React.Component {

  componentDidMount() {
    // get new viewBox value
    let svg = document.querySelector("#section4 svg");
    if (svg) {
    let svgBBox = svg.getBBox();
    let svgWidth = svgBBox.width + svgBBox.x;
    let svgHeight = svgBBox.height + svgBBox.y;
    this.viewBox = '"0 0 ' + svgWidth + ' ' + svgHeight + '"';
    //console.log(this.viewBox);
    //console.log(svg.getBoundingClientRect());
    }
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    const { data, onSelect, callByStep } = this.props
    const setChartData = () => {
      if (callByStep === 2/*3*/) {
        const legendKeys = this.colorKeys.length !== 0 ? this.colorKeys : [""]
        onSelect(legendKeys, this.scale)
      }
    }
    //console.log(this.isSize, viewBox);

    return (
      <svg ref="svg" viewBox={viewBox} preserveAspectRatio="none" style={{
        top: "-4px",
        width: "calc(100% - " + (data.indent - 1) + "px)",
        height: data.height + "%",
        paddingTop: "3px",    
        paddingRight: "2px",  
        marginTop: data.marginTop + "%",
      }} onClick={setChartData}></svg>
    )
  }

  renderChart() {

    /* data */
    const { data, colors, axis, callByStep } = this.props
    const names = data.string1Col
    const numberCols = data.numberCols
    const numberRows = data.numberRows
    const colorGroup = data.string2Col
    //console.log(data);
    const domain = callByStep === 4 && axis ? axis.x.range : d3.extent(numberCols[0])
    const isSize = data.numberCols[2] ? true : false;
    const rangeSize = [3, 30];
    const margin = isSize ? rangeSize[1] : rangeSize[0];
    // using axis.x.range due to editable range @setup2, section 4
    this.colorKeys = uniqueArray(data.string2Col)
    this.isSize = isSize;
    
    // scale
    this.scale = {}
    this.scale.x = d3.scaleLinear()
      .domain(domain)
      .range([0 + margin, width - margin])

    this.scale.y = d3.scaleLinear()
      .domain(d3.extent(numberCols[1]))
      .range([height - margin, 0 + margin])

      const scaleColors = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(colors)

    if (isSize) {
      this.scale.r = d3.scaleLinear()
        .domain(d3.extent(numberCols[2]))
        .range(rangeSize)
    }

    // TODO: overlap case
    // 1 px shift from center following the circle, degree divided by count
    // http://stackoverflow.com/questions/3436453/calculate-coordinates-of-a-regular-polygons-vertices
    //let count = {}
    //numberRows.forEach(n => { count["x"+n[0]+"y"+n[1]] = (count["x"+n[0]+"y"+n[1]] || 0 ) + 1 })
    //console.log(count)

    // chart
    const dataChart = [numberRows.map((n, i) => {
      //const countOverlap = count["x"+n[0]+"y"+n[1]]
      //const isOverlapped = countOverlap > 1
      //if (isOverlapped) console.log(n[0], n[1], countOverlap)
      return {
        x: n[0],
        y: n[1],
        r: n[2],
        color: scaleColors(colorGroup[i]),//colorGroup[group[i]],
        title: names[i] + " [" + n[0] + ", " + n[1] + "]" + (isSize ? ", " + n[2] : "")//,
      }
    })]


    /* draw */
    drawChart(this.refs, dataChart, this.scale, "scatter", colors, callByStep)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot)
