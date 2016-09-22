import React from 'react';
import './section1Input.css';
import validateCTSV from '../lib/validateCTSV';

class Section1 extends React.Component {
    importJSON(e) {
        const dataSrc = e.target.value;
        console.log(dataSrc);
        // varified src
    }
    importCTSV(e) {
        const data = e.target.value;
        validateCTSV(data);
    }

    render() {
        return (
            <div className="section" id="section1">
                <h1>1. Import data as json/csv/tsv <span className="f-app">samples</span></h1>
                <input type="text" className="text" placeholder="Enter url of your json file ..." onChange={this.importJSON.bind(this)}/>
                or
                <textarea className="text textarea" placeholder="Paste your csv/tsv dataset ..." onChange={this.importCTSV.bind(this)}></textarea>
                <div className="btn-flex">
                <input type="button" className="button" value="Import"/>
                <input type="button" className="button btn-right" value="Clear"/>
                </div>
            </div>
        );
    }
}

export default Section1;
