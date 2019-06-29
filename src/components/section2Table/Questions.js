import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers, setQuestions } from '../../actions'
// import _ from "underscore"
import { summarize } from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { timingSafeEqual } from 'crypto';
// import MenuItem from "@material-ui/core/MenuItem"
// import InputAdornment from '@material-ui/core/InputAdornment'
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import ComponentSelectMultiple from './SelectMultiple'


const typeSumstats = ["min", "mean", "median", "max", "percentile2", "percentile98"]
const numberColMapping = [
    { value: "X-AXIS", label: "X-AXIS" },
    { value: "Y-AXIS", label: "Y-AXIS" },
    { value: "SIZE", label: "SIZE" }
];


const mapStateToProps = (state) => ({
    dataAnswer: state.dataAnswer,
    dataSentence: state.dataSentence,
    dataQuestion: state.dataQuestion
})

const mapDispatchToProps = (dispatch) => ({
    setDataAnswer: (answers, sentences) => dispatch(setAnswers(answers, sentences)),
    setDataQuestion: (questions) => dispatch(setQuestions(questions))
})

class Questions extends React.Component {

    handleSets = (event, setId, uiType, indexSet = null, indexUi = null) => {
        const value = (uiType === "switch" ? event.target.checked : event.target.value)

        let newSentences = { ...this.sumstatSentences }
        if (setId === "set2" && uiType === "textField") {
            const replaceText = "{" + value + "}."
            newSentences.edit[indexSet] = newSentences.edit[indexSet].map(s => s.split("{")[0] + replaceText)
            newSentences.text[indexSet] = newSentences.edit[indexSet].map(s => s.split("{")[0] + (value !== "" ? value : "{units}"))
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

        // TODO: update dataChart ?

        this.props.setDataAnswer(newAnswers, newSentences)
    }

    handleSet2FollowUp(event, index1, index2) {
        const {dataQuestion,  setDataAnswer} = this.props

        const newAnswers = { ...this.answers }
        const newAnswerTextFields = newAnswers.set2FollowUp.textField
        newAnswerTextFields[index1][index2] = event.target.value
        const newQuestionAnswer = newAnswerTextFields.map((as, idx) => as.map((a, i) => ({a, q: dataQuestion.sentence[idx][i]}))) 
        const dataParagraph = newQuestionAnswer.map((qas, i) => {
            const index = dataQuestion.index[i]
            return {
                //index: index,
                data: this.dataStats[index.set][index.ui],
                explanation: qas.filter(qa => qa.a !== "")
            }
        })
        console.log(dataParagraph)

        setDataAnswer(newAnswers) 
    }

    handleSubmit() {
        const dataStatsFiltered = this.dataStats
        .map((stats, index) => stats
            .map((s,i) => {
                let qs = sentence(s, "questions");
                return {
                    //data: { ...s, units: this.answers.set2[index].textField },
                    //explanation: qs.map(q => ({ q, a: "{to be answered}" }))
                    index: {set: index, ui:i},
                    explanation: qs
                }}
            ).filter((s, i) => this.answers.set2[index].switch[i])
        ).flat()

        const questions = dataStatsFiltered.map(stats => stats.explanation/*.map(exp => exp.q)*/)
        const index = dataStatsFiltered.map(stats => stats.index )
        // console.log("q:", questions)
        // console.log("i:", index)

        this.answers.set2FollowUp.textField = questions.map(stats => stats.map(s => ""))
        this.props.setDataQuestion({sentence: questions, index: index}) //TODO: add answers
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

        const { dataAnswer, dataSentence, dataQuestion } = this.props
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
            // to have the same test copy
            const sentences = this.dataStats.map(stats => stats.map(s => sentence(s)))
            this.sumstatSentences = {
                edit: sentences,
                text: [...sentences]
            }
            this.answers = {
                set1: {
                    select: numberColMapping.map(mapping => mapping.value),
                    switch: true
                },
                set2: this.dataStats.map(group => ({ textField: "", switch: group.map(s => false/*true*/) })),
                set2FollowUp: { textField: [] },
                set3: { textField: "" }
            }
        } else {
            this.answers = dataAnswer || this.answers
            this.sumstatSentences = dataSentence || this.sumstatSentences
        }

        const followUpCount = dataQuestion ? dataQuestion.sentence.length : 0
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
                            onChange={(event) => this.handleSets(event, setId, "switch", indexSet, indexUi)}
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
                <div key={"tf-" + indexSet + indexUi}>
                    <TextField

                        multiline
                        label={label}
                        rowsMax={rowNumber}
                        value={value}
                        placeholder="Please type your answer here, or leave it empty to skip."
                        onChange={(event) => setId !== "set2FollowUp" ?
                            this.handleSets(event, setId, "textField", indexSet, indexUi) : 
                            this.handleSet2FollowUp(event, indexSet, indexUi)
                        }
                        margin="normal"
                        style={{ width: "66%", ...style }}
                        InputLabelProps={{ shrink: true, }}
                    />
                </div>
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

                <input
                    type="button"
                    className={"button btn-create mb-5 mt-15"}
                    value="Submit"
                    onClick={() => this.handleSubmit()}
                />

                {dataQuestion ? dataQuestion.sentence.map((qs, idx) =>
                    <div key={"qh-" + idx}>
                        <p className="question-set mb-15">{"Follow up question(s): " + parseInt(idx+1) + "/" + followUpCount}</p>
                        {qs.map((q, i) => textFieldComponent(q, this.answers.set2FollowUp.textField[idx][i], "set2FollowUp", idx, i, 3))}
                    </div>
                ) : null}

                {/* <p className="question-set">Question set 3:</p> */}
                {/* {textFieldComponent("Are you focusing on some specific country or a group of them?", this.answers.set3.textField, "set3", null, null, 3)} */}
                {/* <ComponentSelectMultiple dataKeys={dataKeys} label="Are you focusing on some specific country or a group of them?" /> */}
                {/* {selectMultipleComponent("Are you focusing on some specific country or a group of them?")} */}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)