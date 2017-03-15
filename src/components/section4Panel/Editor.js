import React from 'react'
import {connect} from 'react-redux'
import './editor.css'
import {updateAxisYLabelRes, updateAxisYLabelChange, appendAxisYScaleRes} from '../../actions'
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
  yIndent: state.dataChart.indent
})
const mapDispatchToProps = (dispatch) => ({
    setAxisYLabelRes: (isRes, width) => dispatch(updateAxisYLabelRes(isRes, width)),
    setAxisYLabelChange: (dataChange) => dispatch(updateAxisYLabelChange(dataChange)),
    setAxisYScale: (indent) => dispatch(appendAxisYScaleRes(indent))
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
    return Modifier.replaceText(
      contentState,
      editorState.getSelection().merge({
        anchorOffset: 0,
        focusOffset: prevText.length-1,
      }),
      nextText,
      [nextText, style]
    )
  }

  constructor(props) {
    super(props)
    this.isBlur = false

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

    // if blur, prevent second update
    if (this.isBlur && content==="") {
      this.isBlur = false
      return
    }

    // if res due to text content changes
    switch (this.props.type) {

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


  onFocus() {
    this.isBlur = false
    //this.refs.editor.focus()
  }

  /* case 2a: editor out of focus handler */
  onBlur(e) {
    this.isBlur = true
    const editorState = this.state.editorState
    const contentState = editorState.getCurrentContent()
    const content = contentState.getPlainText()
    const isContentEmpty = content.trim() === ""
    const axisType = this.props.type

    // insert text if content is empty but contentReplacement is not
    const contentReplacement = isContentEmpty && (!axisType || axisType.indexOf("Text")>-1) ? "*" : undefined
    /*let contentReplacement = undefined
    if (isContentEmpty) {
      switch (true) {
        // call by a meta content editor such as headline, legend, ...
        case (!axisType): contentReplacement = "* required"; break
        // call by a text editor on y axis with ticks
        case (axisType.indexOf("Text") > -1): contentReplacement = "*"; break
        // those that can have empty content ex:
        // call by a label editor on y axis (no ticks)
        default: // console.log("empty content is acceptable")
      }
    }*/

    let newEditorState = editorState
    if (isContentEmpty && contentReplacement) {
      const style = this.props.bold ? "BOLD" : ""
      const contentStateReplace = this.modifyContentStateReplace(editorState, contentState, content, contentReplacement, style)
      newEditorState = EditorState.push(editorState, contentStateReplace, 'insert-characters')
      // TODO: blur after text replacement
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
        onFocus={this.onFocus.bind(this)}
        spellCheck={true}
        stripPastedStyles={true}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineEditor)
