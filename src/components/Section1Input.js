import React from 'react';
import { connect } from 'react-redux';
import './section1Input.css';
import { importData, clearData } from '../actions';
import fetchConfig from '../data/config'

const instruction = "Type your data or copy & paste it from a spreadsheet."

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  onClickImport: (textarea) => {
    // in case of empty input
    textarea.value.trim() && dispatch(importData(textarea.value))
  },
  onClickClear: (textarea/*, textInput*/) => {
    // [textarea, textInput].forEach(input => input.value= "")
    textarea.value = ""
    dispatch(clearData());
  }
});


class Section extends React.Component {

  openFile(e) {
    const dataSrc = e.target.value;
    console.log(dataSrc);
  }
  chooseFile(e) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      let file = e.target.files;
      console.log("file name:", file);
    } else {
      console.log("File APIs are not supported")
    }
  }

  render() {
    console.log("render step 1")
    let textarea, textInput;
    const {onClickImport, onClickClear } = this.props;

    return (
      <div className="section" id="section1" ref={(node) => this.node = node}>
        <h1>1. Import data {/*or *html file {/*<span className="f-app">samples</span>*/}</h1>
        {/*<div className="row-flex p-r">
          <input type="text" className="text" placeholder="Enter url of your html file ..." ref={node=>textInput=node} onChange={this.openFile.bind(this)}/>
          <input type="file" className="file o-0" value="" onChange={this.chooseFile.bind(this)} />
          <label className="button file-shell">Choose a file</label>
        </div>*/}
        <p className="instruction">Instruction: {instruction}</p>
        <textarea className="textarea" placeholder="your csv/tsv dataset goes here ..." ref={node => textarea = node}></textarea>
        <div className="row-flex">
          <input type="button" className="button btn-import" value="Import" onClick={() => onClickImport(textarea)} />
          <input type="button" className="button btn-clear" value="Clear" onClick={() => onClickClear(textarea, textInput)} />
        </div>

        {/* test hidden ground */}
        <span className="test ff-data js-test-x"></span>
        <span className="test ff-ss js-test-y"></span>
      </div>
    );
  }

  componentDidMount() {
    // load cfg file
    fetchConfig();
    console.log("[data] fetch config");
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
