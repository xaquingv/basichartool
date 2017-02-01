import React from 'react'
import {connect} from 'react-redux'
//import {updateSize} from '../../actions'
import {d3} from '../../lib/d3-lite'

const mapStateToProps = (state) => ({
  step: state.step
  //size: state.dataSetup.size
})

const mapDispatchToProps = (dispatch) => ({
  //onChangeSize: (key) => dispatch(updateSize(key))
})


class Display extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.step === 4
  }

  componentDidUpdate() {

    const elSvg = document.querySelector("#section4 svg")
    if (elSvg) {
      elSvg.setAttribute("viewBox", "0 0 300 180")
      elSvg.setAttribute("preserveAspectRatio", "none")
    }

    const elChart = document.querySelector(".js-chart")
    d3.select(this.refs.width).text(elChart.offsetWidth)
    d3.select(this.refs.height).text(elChart.offsetHeight)
  }


  render() {
    return (
      <div>Width x Height:
        <span ref="width"></span>x
        <span ref="height"></span> px
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Display)
