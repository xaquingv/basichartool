import React from 'react'
import {connect} from 'react-redux'
import {colors} from '../../data/config'
import {pickColor, dropColorTo, updateCustomColor} from '../../actions'
//import icon from '../../assets/icon/colordrop.svg'


const regexHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i

const mapStateToProps = (state) => ({
  id: state.chartId,
  step: state.step,
  dataEditable: state.dataEditable,
  colorPicked: state.dataSetup.pickColor,
  legend: state.dataChart.legend
})

const mapDispatchToProps = (dispatch) => ({
  onChangeColor: (color) => dispatch(updateCustomColor(color)),
  onPickColor: (color) => dispatch(pickColor(color)),
  onPickDropColorTo0: () => dispatch(dropColorTo(0))
})


class Palette extends React.Component {

  render() {
    const {id, step, dataEditable, colorPicked, legend} = this.props
    if (step !== 4) {return null}

    /* data */
    this.colorInput = dataEditable.colorInput || colors.slice(-1)[0]
    this.colorStyle = this.colorStyle || this.colorInput
    this.isOneColorLine = id.includes("line") && legend.length === 1

    /* draw */
    // palette colors
    const defaultPaletteColors =
      colors.slice(0, -1).map((color, i) =>
        <li key={i} style={{backgroundColor: color}} onDoubleClick={this.onClick.bind(this, color)}></li>
      )

    // custom color
    const editableColorInput =
      <li className="li-custom" style={{borderColor: this.colorStyle}} onDoubleClick={this.onClick.bind(this, this.colorStyle)}>
        <input style={{color: this.colorStyle}}
          onClick={(e) => { e.target.select() }}
          onChange={this.onChange.bind(this)}
          //onMouseOut={this.onBlurWithValidation.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          value={this.colorInput}
        />
      </li>

    const pickedColor = colorPicked ? (
      <span className="p-r">(
        <svg className="color-picked" width="24" height="24" style={{fill: colorPicked}}>
          <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
        </svg>
        <span className="ml-10"> is picked, drop with *DoubleClick)</span>
      </span>
    ) : <span>(*DoubleClick to pick a color)</span>

    return colors ? (
      <div>Palette:{pickedColor}
        <ul className="palette">
          {defaultPaletteColors}
          {editableColorInput}
        </ul>
      </div>
    ) : null
  }

  // palette colors
  onClick(color) {
    const {onPickColor, onPickDropColorTo0} = this.props

    onPickColor(color)
    if (this.isOneColorLine) {onPickDropColorTo0()}
  }

  // custom color
  onChange(e) {
    // max length 7
    this.colorInput = e.target.value.slice(0, 7)
    this.props.onChangeColor(this.colorInput)

    // if input is valid, dispatch
    // validation: # follows by 3 to 6 [0-9] digtis or [a-f] chars (no sensitive)
    if (regexHex.test(this.colorInput)) {
      this.colorStyle = this.colorInput
    }
  }

  onBlurWithValidation(e) {
    const {onPickColor, onPickDropColorTo0, onChangeColor} = this.props

    if (regexHex.test(this.colorInput)) {
      onPickColor(this.colorStyle)
      if (this.isOneColorLine) {onPickDropColorTo0()}
    } else {
      this.colorInput = this.colorStyle
      onChangeColor(this.colorInput)
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
