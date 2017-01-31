import React from 'react'
import {connect} from 'react-redux'
import {colors} from '../../data/config'
import {pickColor} from '../../actions'


const mapStateToProps = (state) => ({
  step: state.step
})

const mapDispatchToProps = (dispatch) => ({
  onPickColor: (color) => dispatch(pickColor(color))
})


class Palette extends React.Component {

  render() {
    const {step, onPickColor} = this.props
    // TODO: double check
    if (step !==4) {return null}

    const setupPaletteColors = colors
    ? colors.slice(0, -1).map((color, i) =>
      <li key={i} style={{backgroundColor: color}} onClick={()=>onPickColor(color)}></li>
    )
    : null

    const defaultCustomColor = "#000000"
    return (
      <div>Palette colors:
        <ul className="palette">
          {setupPaletteColors}
          {/*<li className="li-custom"><span contentEditable={true}>#000000</span></li>*/}
          <li className="li-custom" onClick={()=>onPickColor(defaultCustomColor)}><span>{defaultCustomColor}</span></li>
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
