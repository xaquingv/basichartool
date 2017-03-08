import React from 'react'
import {connect} from 'react-redux'
import './editor.css'

/* editor ref: draftjs.org/docs
/* example: https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/convertFromHTML/convert.html */
/* In this editor, there are 3 cases to trigger content update */
import {Editor, EditorState, ContentState, convertFromHTML, RichUtils} from 'draft-js'


let isBlur = false
const mapStateToProps = (state) => ({
})
const mapDispatchToProps = (dispatch) => ({
})


class InlineEditor extends React.Component {
  getEditorState(text) {
    // set text and bold style
    const html = this.props.bold ? '<b>'+text+'</b>' : text
    const blockArray = convertFromHTML(html)
    const contentState = ContentState.createFromBlockArray(blockArray.contentBlocks, blockArray.entityMap)
    return EditorState.createWithContent(contentState)
  }

  constructor(props) {
    super(props)

    // init editorState
    const editorState = this.getEditorState(props.text)
    this.state = {editorState: editorState}
  }

  /* case 1: input change handler */
  onChange(editorState, who) {
    const contentState = editorState.getCurrentContent()
    const content = contentState.getPlainText().trim()
    switch (true) {
      case (isBlur && content===""):
        return null
      default:
        return this.setState({editorState})
    }
  }

  onFocus() {
    isBlur = false
  }

  /* case 2a: editor out of focus handler */
  onBlur() {
    isBlur = true
    const content = this.state.editorState.getCurrentContent().getPlainText().trim()
    const newEditorState = content === "" ? this.getEditorState("* required") : this.state.editorState

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
