import React from 'react'
import {connect} from 'react-redux'
import {colors} from '../../data/config'
import {pickColor, updateCustomColor} from '../../actions'


const regexHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i

const mapStateToProps = (state) => ({
  step: state.step,
  dataEditable: state.dataEditable
})

const mapDispatchToProps = (dispatch) => ({
  onPickColor: (color) => dispatch(pickColor(color)),
  onChangeColor: (color) => dispatch(updateCustomColor(color))
})


class Palette extends React.Component {

  render() {
    const {step, onPickColor, dataEditable} = this.props
    if (step !== 4) {return null}

    // palette colors
    const defaultPaletteColors =
      colors.slice(0, -1).map((color, i) =>
        <li key={i} style={{backgroundColor: color}} onClick={()=>onPickColor(color)}></li>
      )

    // custom color
    this.colorInput = dataEditable.colorInput || colors.slice(-1)[0]
    this.colorStyle = this.colorStyle || this.colorInput
    const editablecolorInput =
      <li className="li-custom" style={{borderColor: this.colorStyle}} onClick={()=>onPickColor(this.colorStyle)}>
        <input style={{color: this.colorStyle}}
          onClick={(e) => { e.target.select() }}
          onChange={this.onChange.bind(this)}
          onMouseOut={this.onBlurWithValidation.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          value={this.colorInput}
        />
      </li>

    return colors ? (
      <div>Palette colors:
        <ul className="palette">
          {defaultPaletteColors}
          {editablecolorInput}
        </ul>
      </div>
    ) : null
  }

  // custom color events
  onChange(e) {
    // max length 7
    this.colorInput = e.target.value.slice(0, 7)
    this.props.onChangeColor(this.colorInput)

    // if input is valid, dispatch
    // validation: # follows by 3 to 6 [0-9] digtis or [a-f] chars (no sensitive)
    this.isHex = regexHex.test(this.colorInput)
    if (this.isHex) {
      this.colorStyle = this.colorInput
      this.props.onPickColor(this.colorStyle)
    }
  }
  onBlurWithValidation(e) {
    if (!this.isHex) {
      this.colorInput = this.colorStyle
      this.props.onChangeColor(this.colorInput)
      this.props.onPickColor(this.colorStyle)
    }
    e.target.blur()
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onBlurWithValidation(e)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
