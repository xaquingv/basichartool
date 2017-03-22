import React from 'react'
import {connect} from 'react-redux'
import './editor.css'
import {uniqueArray} from '../../lib/array.js'
import {updateAxisYLabelRes, updateAxisYLabelChange, appendAxisYScaleRes, updateAxisDataOnTypes, updateScaleRange} from '../../actions'
import {getAxisYLabelRes, getAxisYLabelChange, getAxisYTextWidth} from '../../data/calcAxisYText'
import axisXResponsive from './axisXTextAndSvgResponsive'
//import axisYResponsive from './axisYTextResponsive'

/* editor ref: draftjs.org/docs
/* example: https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/convertFromHTML/convert.html */
/* In this editor, there are 3 cases to trigger content update */
import {Editor, EditorState, ContentState, convertFromHTML, RichUtils, Modifier} from 'draft-js'


const mapStateToProps = (state) => ({
  chartId: state.chartId,
  yLabels: state.dataChart.rowGroup,
  yIndent: state.dataChart.indent,
  dataRanges: state.dataChart.ranges,
  axis: state.dataEditable.axis
})
const mapDispatchToProps = (dispatch) => ({
    setAxisYLabelRes: (isRes, width) => dispatch(updateAxisYLabelRes(isRes, width)),
    setAxisYLabelChange: (dataChange) => dispatch(updateAxisYLabelChange(dataChange)),
    setAxisYScale: (indent) => dispatch(appendAxisYScaleRes(indent)),
    setAxisDataOnTypes: (target1, target2, dataTarget) => dispatch(updateAxisDataOnTypes(target1, target2, dataTarget)),
    setAxisScaleRange: (target, range) => dispatch(updateScaleRange(target, range))
})


class InlineEditor extends React.Component {
  createEditorState(text) {
    // set text and bold style
    const html = this.props.bold ? '<b>'+text+'</b>' : text
    const blockArray = convertFromHTML(html)
    const contentState = ContentState.createFromBlockArray(blockArray.contentBlocks, blockArray.entityMap)
    return EditorState.createWithContent(contentState)
  }

  modifyContentStateReplace(editorState, contentState, prevText, nextText, style="") {
    // ref: https://github.com/react-component/editor-mention/blob/db5cfa300ebc773f70e304c46c7b9a0c48b5f00d/src/utils/insertMention.jsx
    return Modifier.replaceText(
      contentState,
      editorState.getSelection().merge({
        anchorOffset: 0,
        focusOffset: prevText.length,
      }),
      nextText,
      [nextText, style]
    )
  }

  constructor(props) {
    super(props)

    // init editorState
    const editorState = this.createEditorState(props.text)
    this.state = {editorState: editorState}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text === nextProps.text) return

    // update if content changes
    const editorState = this.createEditorState(nextProps.text)
    this.state = {editorState: editorState}
  }

  /* case 1: input change handler
  /* note that all updates goes through here */
  onChange(editorState, who) {
    const contentState = editorState.getCurrentContent()
    const content = contentState.getPlainText().trim()
    const type = this.props.type

    // if blur, prevent second update by input change
    // TODO: debug and remove this weird hack
    if (this.contentReplacement) {
      this.cancelOnChange = true
      this.contentReplacement = undefined
    } else if (this.cancelOnChange) {
      this.cancelOnChange = false
      return
    }

    // 1. update store data or
    // 2. res due to text content changes
    switch (type) {

      case "xTexts":
        setTimeout(() => axisXResponsive(), 10) // update after onChange ?
        break

      case "yLabel":
        const {yLabels, setAxisYLabelRes, setAxisYLabelChange} = this.props
        const dataLabelChange = getAxisYLabelChange(yLabels)
        if (dataLabelChange) {
          setAxisYLabelRes(getAxisYLabelRes())
          setAxisYLabelChange(dataLabelChange)
        }
        break

      case "yTexts":
        // max char limitation with exception of the top tick
        const max = this.props.isTop ? 36 : 12
        if (content.length > max) {
          const contentReplacement = content.slice(0, max)
          const contentStateReplace = this.modifyContentStateReplace(editorState, contentState, content, contentReplacement)
          editorState = EditorState.push(editorState, contentStateReplace, 'insert-characters')
          // TODO: handlebeforeinput? last char update
        }

        // res update
        const {yIndent, setAxisYScale, chartId} = this.props
        const indent = getAxisYTextWidth(chartId)
        if (indent !== yIndent) {
          setAxisYScale(indent)
        }
        break

      default: //console.log("res not required")
    }

    return this.setState({editorState})
  }

  /* case 2a: editor out of focus handler */
  onBlur(e) {
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const content = contentState.getPlainText()
    const isContentEmpty = content.trim() === ""
    const axisType = this.props.type || ""

    this.contentReplacement = undefined

    /* call by a meta or a text with ticks in the graph */
    if (isContentEmpty && (axisType.indexOf("Text") > -1 || !axisType)) {
      this.contentReplacement = "*"
    }

    /* call by ticks or range in setup 2 */
    else if (axisType.indexOf("Tick") > -1 || axisType.indexOf("Range") > -1) {
      const {axis, dataRanges} = this.props
      const axisTypeData = axis[axisType[0]]

      let axisTarget = axisType.slice(1, axisType.length).toLowerCase()
      let contentOld = /*axisTypeData.isDate ? axisTypeData.texts.join(", ") :*/ axisTypeData[axisTarget].join(", ")
      //console.log(contentOld)
      // content no change
      if (content === contentOld) return

      // content changed
      // data preprocess: input str -> arr -> sort (number) -> remove duplicates
      const dataTarget = uniqueArray(content.split(",").map(d => parseFloat(d)).sort((n1, n2) => n1 - n2))
      const validation = validate(axisTarget, dataTarget, dataRanges[axisType[0]], axis[axisType[0]].range)
      const contentNew = dataTarget.join(", ")

      // update ticks or range if vaild
      // replace content with new/old content if changed
      if (validation) {
        this.props.setAxisDataOnTypes(axisType[0], axisTarget, dataTarget)
        this.contentReplacement = contentNew !== content ? contentNew : undefined
      } else {
        this.contentReplacement = contentOld
      }
    }

    let newEditorState = editorState
    if (this.contentReplacement) {
      const style = this.props.bold ? "BOLD" : ""
      const contentStateReplace = this.modifyContentStateReplace(editorState, contentState, content, this.contentReplacement, style)
      newEditorState = EditorState.push(editorState, contentStateReplace, 'insert-characters')
      // TODO: blur after text replacement ?
    }

    this.onChange(newEditorState, "blur")
    return 'handled'
  }

  /* case 2b: enter/return key handler for
  /* 1. single line editing only
  /* 2. setting cursor out of focus */
  handleReturn(e) {
    e.target.blur()
    return 'handled'
  }

  /* case 3: shortcut keys handler
  /* RichUtils has information about the core key commands available to web editors,
  /* such as Cmd+B (bold), Cmd+I (italic), and so on. */
  handleKeyCommand(command) {
    const newEditorState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newEditorState) {
      this.onChange(newEditorState, "key")
      return 'handled'
    }
    return 'not-handled'
  }


  render() {
    return (
      <Editor
        ref="editor"
        editorState={this.state.editorState}
        onChange={this.onChange.bind(this)}
        handleKeyCommand={this.handleKeyCommand.bind(this)}
        handleReturn={this.handleReturn.bind(this)}
        onBlur={this.onBlur.bind(this)}
        spellCheck={true}
        stripPastedStyles={true}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineEditor)


function validate(axisType, input, dataRange, axisRange) {
  switch(axisType) {
    case "ticks":
      return (
        input.length > 0 &&
        input[0] >= axisRange[0] &&
        input[input.length-1] <= axisRange[1]
      )
    case "range":
      return (
        input.length === 2 &&
        input[0] <= dataRange[0] &&
        input[1] >= dataRange[1]
      )
    default:
      console.warn("validation not available!")
  }
}
