import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers } from '../../actions'
// import _ from "underscore"
import { summarize } from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
// import MenuItem from "@material-ui/core/MenuItem"
// import InputAdornment from '@material-ui/core/InputAdornment'
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import ComponentSelectMultiple from './SelectMultiple'


const typeSumstats = ["min", "mean", "median", "max", "mode", "percentile2", "percentile98"]
const numberColMapping = [
    { value: "X-AXIS", label: "X-AXIS" },
    { value: "Y-AXIS", label: "Y-AXIS" },
    { value: "SIZE", label: "SIZE" }
];


const mapStateToProps = (state) => ({
    dataAnswer: state.dataAnswer,
    dataSentence: state.dataSentence
})

const mapDispatchToProps = (dispatch) => ({
    setDataAnswer: (answers, sentences) => dispatch(setAnswers(answers, sentences)),
})

class Questions extends React.Component {

    handleChange = (event, setId, uiType, indexSet = null, indexUi = null) => {
        const value = (uiType === "switch" ? event.target.checked : event.target.value)

        let newSentences = { ...this.sumstatSentences }
        if (setId === "set2" && uiType === "textField") {
            const replaceText = "{" + value + "}."
            newSentences.edit[indexSet] = newSentences.edit[indexSet].map(s => s.split("{")[0] + replaceText)
            newSentences.text[indexSet] = newSentences.edit[indexSet].map(s => {
                s = s.replace("{", "")
                s = s.replace("}.", "")
                return s
            })
        }

        // TODO: debug for switch
        if (setId === "set2" && uiType === "switch") {
            console.log(this.answers)
            console.log("debug:", setId, uiType, indexSet, indexUi)
        }

        let newAnswers = { ...this.answers }
        if (indexSet !== null && indexUi !== null) {
            newAnswers[setId][indexSet][uiType][indexUi] = value
        } else if (indexSet !== null) {
            newAnswers[setId][indexSet][uiType] = value
        } else if (indexUi !== null) {
            newAnswers[setId][uiType][indexUi] = value
        } else {
            newAnswers[setId][uiType] = value
        }

        // TODO: add to ui
        // const dataStatsFiltered = this.dataStats.map((stats, index) => stats
        //     .filter((s, i) => newAnswers.set2[index].switch[i])
        //     .map(s => {
        //         let qs = sentence(s, "questions");
        //         return {
        //             data: s,
        //             explanation: qs.map(q => ({ q, a: "{to be answered}"}))
        //         }
        //     }
        //     )
        // )
        // console.log(JSON.stringify(dataStatsFiltered.flat()))

        // TODO: stats.forEach(d=> { d.units = 'years'; d.type = 'countries'; });
        // TODO: update dataChart ?

        this.props.setDataAnswer(newAnswers, newSentences)
    }

    componentDidMount() {
        this.numberCols = [[]]
        this.string1Col = []
    }
    componentDidUpdate() {
        this.numberCols = this.props.dataChart.numberCols//numberCols
    }

    render() {
        const { dataChart } = this.props
        if (!dataChart) { return null; }

        const { dataAnswer, dataSentence } = this.props
        const { dateCol, numberCols, string1Col } = dataChart
        if ((string1Col.length < 1 && dateCol.length < 1) || numberCols.length < 1) { return null; }

        /* example:
        const data = [...new Array(201)].map((d, i)=> {
        return i = {key: Math.random().toString(36).substring(2, 15), value: Math.random()}; });
        const stats = sumstats('column', data, 'mean', 'median', 'percentile98');
        console.log(stats);*/

        /* data */
        const numberColGroups = dataChart.keys
        const isNumberColSame = this.numberCols.length === numberCols.length
        this.isDataChange = (!isNumberColSame) || (isNumberColSame ? (this.numberCols.some((col, i) => col.toString() !== numberCols[i].toString())) : false)
        console.log(this.isDataChange)
        // note that can make underscore isequal work here

        const keys = string1Col// || dateCol
        // const dataKeys = keys.map(key => ({ label: key, value: key }))

        if (this.isDataChange) {
            this.dataStats = numberCols.map((col, idx) => {
                // params: col header, data, type of sumstats1, 2, 3, ///
                return summarize(
                    dataChart.keys[idx],
                    col.map((value, index) => ({ key: keys[index], value })),
                    "country", //hotfix
                    ...typeSumstats
                )
            })
            this.sumstatSentences = {
                edit: this.dataStats.map(stats => stats.map(s => sentence(s))),
                text: this.dataStats.map(stats => stats.map(s => sentence(s)))
            }
            this.answers = {
                set1: {
                    select: numberColMapping.map(mapping => mapping.value),
                    switch: true
                },
                set2: this.dataStats.map(group => ({ textField: "", switch: group.map(s => true) })),
                set2FollowUp: { textField: [] },
                set3: { textField: "" }
            }
        } else {
            this.answers = dataAnswer || this.answers
            this.sumstatSentences = dataSentence || this.sumstatSentences
        }

        // const mappingCount = numberColGroups.length
        // const mapping = numberColMapping.filter((number, index) => index < mappingCount)

        // const selectComponent = (index, start) => {
        //     const marginRight = (index + 1) % 3 !== 0 ? "2%" : "0"
        //     return (
        //         <TextField
        //             key={"select-" + index}
        //             select
        //             label="Change your mapping"
        //             value={this.answers.set1.select[index]}
        //             onChange={(event) => this.handleChange(event, "set1", "select", null, index)}
        //             style={{ width: "32%", marginRight: marginRight }}
        //             InputProps={{
        //                 startAdornment: <InputAdornment position="start">{start + " :"}</InputAdornment>,
        //             }}
        //         >
        //             {mapping.map(option => (
        //                 <MenuItem key={option.value} value={option.value}>
        //                     {option.label}
        //                 </MenuItem>
        //             ))}
        //         </TextField>
        //     )
        // }

        const switchComponent = (label, checked, setId, indexSet, indexUi, style = {}) => {
            return (
                <div key={"switch-" + indexSet + indexUi}>
                    <FormControlLabel
                        control={<Switch
                            checked={checked}
                            onChange={(event) => this.handleChange(event, setId, "switch", indexSet, indexUi)}
                            color="primary"
                        />}
                        label={label}
                        style={style}
                    />
                </div>
            );
        }

        const textFieldComponent = (label, value, setId, indexSet = null, indexUi = null, rowNumber = 1, style = {}) => {
            return (
                <TextField
                    multiline
                    label={label}
                    rowsMax={rowNumber}
                    value={value}
                    placeholder="Please type your answer here, or leave it empty to skip."
                    onChange={(event) => this.handleChange(event, setId, "textField", indexSet, indexUi)}
                    margin="normal"
                    style={{ width: "66%", ...style }}
                    InputLabelProps={{ shrink: true, }}
                />
            )
        }

        // const animatedComponents = makeAnimated();
        // const selectMultipleComponent = (label) => {
        //     return (
        //         <Select
        //             isMulti
        //             closeMenuOnSelect={false}
        //             components={animatedComponents}
        //             defaultValue={dataKeys[0]}
        //             options={dataKeys}
        //         />
        //     );
        // }

        return (
            <div className="questions">
                {/* <p className="question-set">Question set 1:</p>
                <div>{numberColGroups.map((group, idx) => selectComponent(idx, group))}</div>
                {switchComponent("Do you want to highlight the correlation between gdp and life expectancy?", this.answers.set1.switch, "set1", null, null, { marginTop: "8px" })} */}

                <p className="question-set mb-5">Question set: statistical summary</p>
                {this.dataStats.map((dataList, idx) =>
                    <div key={"qh-" + idx} className="mb-5">
                        <p><span className="question-group">{numberColGroups[idx]}</span></p>
                        {textFieldComponent("What are the " + numberColGroups[idx] + " numbers referring to? (e.g. dollars, people, years ...)", this.answers.set2[idx].textField, "set2", idx)}
                        {dataList.map((data, i) => switchComponent(this.sumstatSentences.text[idx][i], this.answers.set2[idx].switch[i], "set2", idx, i))}
                    </div>
                )}
                {textFieldComponent("Why do Australia, Japan, Spain, Switzerland have such a high life expentancy?", this.answers.set2FollowUp.textField[0], "set2FollowUp", null, 0, 3, { marginTop: "8px" })}

                {/* <p className="question-set">Question set 3:</p> */}
                {/* {textFieldComponent("Are you focusing on some specific country or a group of them?", this.answers.set3.textField, "set3", null, null, 3)} */}
                {/* <ComponentSelectMultiple dataKeys={dataKeys} label="Are you focusing on some specific country or a group of them?" /> */}
                {/* {selectMultipleComponent("Are you focusing on some specific country or a group of them?")} */}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)