import React from 'react'
import {connect} from 'react-redux'
import {updateWidth, updateSize} from '../../actions'
import axisXResponsive from './axisXTextAndSvgResponsive'
import axisYResponsive from './axisYTextResponsive'

/*const widths = [
  {val: 300, txt: "300px"},
  {val: 620, txt: "620px"},
  {val: 860, txt: "860px"},
  {val: "free", txt: "100%"}
]*/

const mapStateToProps = (state) => ({
  widthChart: state.dataSetup.width,
  widthLabel: state.dataChart.string1Width,
})

const mapDispatchToProps = (dispatch) => ({
  setWidth: (width) => dispatch(updateWidth(width)),
  setSize: (size) => dispatch(updateSize(size))
})


class Responsive extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.widthChart !== this.props.widthChart
  }
  componentDidUpdate() {
    const {widthLabel, setSize} = this.props
    // delay due to transition animation
    setTimeout(() => {
      const elChart = document.querySelector(".js-chart")
      setSize({w: elChart.offsetWidth, h: elChart.offsetHeight})
      axisYResponsive(widthLabel)
      axisXResponsive()
    }, 1000)
  }

  render() {
    const {widthChart, setWidth} = this.props

    return (
      <div>Responsive:
        <span style={{color: "#ccc"}}>
        <span onClick={()=>setWidth("300px")} style={{color: widthChart === "300px" ? "black" : false}} className="c-p">300</span>-
        <span onClick={()=>setWidth("620px")} style={{color: widthChart === "620px" ? "black" : false}} className="c-p">620</span>-
        <span onClick={()=>setWidth("860px")} style={{color: widthChart === "860px" ? "black" : false}} className="c-p">860</span>
        </span>px ||
        <span onClick={()=>setWidth("100%")} style={{color: widthChart === "100%" ? "black" : "#ccc"}} className="c-p">free</span>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Responsive)
