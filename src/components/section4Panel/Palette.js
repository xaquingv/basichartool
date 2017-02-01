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
    if (step !==4) {return null}

    // palette colors
    const defaultPaletteColors =
      colors.slice(0, -1).map((color, i) =>
        <li key={i} style={{backgroundColor: color}} onClick={()=>onPickColor(color)}></li>
      )

    // custom color
    const defaultCustomColor = colors.slice(-1)
    const editableCustomColor =
      <li className="li-custom" onClick={()=>onPickColor(defaultCustomColor)}>
        <span>{defaultCustomColor}</span>
      </li>
      //<li className="li-custom"><span contentEditable={true}>#000000</span></li>

    return colors ? (
      <div>Palette colors:
        <ul className="palette">
          {defaultPaletteColors}
          {editableCustomColor}
        </ul>
      </div>
    ) : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
