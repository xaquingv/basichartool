import React from 'react';
import {connect} from 'react-redux';
import './section1Input.css';
import {inputData, importData, nextStep, activeStep} from '../actions';

const STEP = 1;
// read https://facebook.github.io/react/docs/forms.html
const mapDispatchToProps = (dispatch) => ({
  onClickImport: (textarea) => {
    dispatch(importData(textarea.value));
    dispatch(inputData(textarea.value));
    dispatch(nextStep(STEP));
    dispatch(activeStep(STEP));
  },
  onClickClear: (textarea, textInput) => {
    [textarea, textInput].forEach(input => input.value= "");
    dispatch(inputData(textarea.value));
  }
});

const mapStateToProps = (state) => ({
  state
});


class Section extends React.Component {
  /*STEP = 1;
  focusIfChosenStep = () => {
    console.log('focusIfChosenStep', this.props.step, this.STEP);
    if (this.props.step === this.STEP) {
      //console.log('focus', this.node);
      //let to = this.node.offsetTop - 60;
      //scrollTo(to, null, 1000);
    }
  };
  componentDidUpdate() {
    this.focusIfChosenStep();
  }*/

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
    let textarea, textInput;

    const {state, onClickImport, onClickClear} = this.props;
    //console.log(state.step, "(cur)", state.stepActive, "(active)");
    console.log(state);

    return (
      <div className="section" id="section1" ref={(node) => this.node = node}>
        <h1>1. Import data or *html file <span className="f-app">samples</span></h1>
        <div className="row-flex p-r">
          <input type="text" className="text" placeholder="Enter url of your json/csv/tsv/html file ..." ref={node=>textInput=node} onChange={this.openFile.bind(this)}/>
          <input type="file" className="file o-0" value="" onChange={this.chooseFile.bind(this)} />
          <label className="button file-shell">Choose a file</label>
        </div>
        <p>or copy &</p>
        <textarea className="textarea" placeholder="Paste your csv/tsv dataset ..." ref={node=>textarea=node}></textarea>
        <div className="row-flex">
          <input type="button" className="button btn-import" value="Import" onClick={()=>onClickImport(textarea)}/>
          <input type="button" className="button" value="Clear" onClick={()=>onClickClear(textarea, textInput)}/>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
