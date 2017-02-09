import React from 'react'
import {connect} from 'react-redux'
import {updateWidth} from '../../actions'

/*const widths = [
  {val: 300, txt: "300px"},
  {val: 620, txt: "620px"},
  {val: 860, txt: "860px"},
  {val: "free", txt: "100%"}
]*/

const mapStateToProps = (state) => ({
  width: state.dataSetup.width
})

const mapDispatchToProps = (dispatch) => ({
  setWidth: (width) => dispatch(updateWidth(width))
})


class Display extends React.Component {

  render() {
    const {width, setWidth} = this.props

    return (
      <div>Responsive:
        <span style={{color: "#ccc"}}>
        <span onClick={()=>setWidth("300px")} style={{color: width === "300px" ? "black" : false}} className="c-p">300</span>-
        <span onClick={()=>setWidth("620px")} style={{color: width === "620px" ? "black" : false}} className="c-p">620</span>-
        <span onClick={()=>setWidth("860px")} style={{color: width === "860px" ? "black" : false}} className="c-p">860</span>
        </span>px ||
        <span onClick={()=>setWidth("100%")} style={{color: width === "100%" ? "black" : "#ccc"}} className="c-p">free</span>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Display)
