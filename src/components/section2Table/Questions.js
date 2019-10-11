import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers, setQuestions, setParagraph } from '../../actions'
import { chartTasks } from '../../data/config';

import { summarize } from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'
import write from '../../lib/write-data'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import ComponentSelectMultiple from './SelectMultiple'


const regAnyInCB = /{([^}]*)}/ // match 0 or more chars in {} (curly braces)
const typeSumstats = ["min", "mean", "median", "max", "percentile2", "percentile98", "roi"] // roi -> regions of interest

const mapStateToProps = (state) => ({
    dataAnswer: state.dataAnswer,
    dataSentence: state.dataSentence,
    dataQuestion: state.dataQuestion,
    selectionInOrder: state.selectionInOrder
})

const mapDispatchToProps = (dispatch) => ({
    setDataAnswer: (answers, sentences) => dispatch(setAnswers(answers, sentences)),
    setDataQuestion: (questions) => dispatch(setQuestions(questions)),
    setDataParagraph: (paragraph, chart, id) => dispatch(setParagraph(paragraph, chart, id))
})

class Questions extends React.Component {

    handleSets(event, setId, uiType, indexSet = null, indexUi = null) {
        const value = (uiType === "switch" ? event.target.checked : event.target.value)

        let newSentences = { ...this.sumstatSentences }
        if (setId === "set2" && uiType === "textField") {
            const replaceText = "{" + value + "}"
            newSentences.edit[indexSet] = newSentences.edit[indexSet].map(s => s.replace(regAnyInCB, replaceText))
            newSentences.text[indexSet] = newSentences.edit[indexSet].map(s => s.replace(regAnyInCB, (value !== "" ? value : "{units}")))
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

        // TODO: update selection order
        // TODO: debug, check on https://reactjs.org/docs/forms.html#controlled-components
        if (setId === "set1" && uiType === "select") {
            const selectIndex = this.selectionTasks.findIndex(task => task === value)
            const selectionInOrder = this.props.selectionInOrder
            selectionInOrder.forEach((select, index) => document.querySelector("#" + select).setAttribute("class", (index !== selectIndex) ? "order2" : "order1"))
        }

        this.props.setDataAnswer(newAnswers, newSentences)
    }

    handleSet2FollowUp(event, index1, index2) {
        const { setDataAnswer } = this.props

        const newAnswers = { ...this.answers }
        const newAnswerTextFields = newAnswers.set2FollowUp.textField
        newAnswerTextFields[index1][index2] = event.target.value
        setDataAnswer(newAnswers)
    }

    handleContinue() {
        const dataStatsFiltered = this.dataStats
            .map((stats, index) => stats
                .map((s, i) => {
                    let qs = sentence(s, "questions");
                    return {
                        //data: { ...s, units: this.answers.set2[index].textField },
                        //explanation: qs.map(q => ({ q, a: "{to be answered}" }))
                        index: { set: index, ui: i },
                        explanation: qs
                    }
                }
                ).filter((s, i) => this.answers.set2[index].switch[i])
            ).flat()

        const questions = dataStatsFiltered.map(stats => stats.explanation/*.map(exp => exp.q)*/)
        const index = dataStatsFiltered.map(stats => stats.index)

        this.answers.set2FollowUp.textField = questions.map(stats => stats.map(s => ""))
        this.props.setDataQuestion({ sentence: questions, index: index }) //TODO: add answers
    }

    handleSubmit() {
        const { dataQuestion, setDataParagraph, dataChart } = this.props
        const newQuestionAnswer = this.answers.set2FollowUp.textField.map((as, idx) => as.map((a, i) => ({ a, q: dataQuestion.sentence[idx][i] })))
        const dataParagraph = newQuestionAnswer.map((qas, i) => {
            const index = dataQuestion.index[i]
            return {
                //index: index,
                data: {
                    ...this.dataStats[index.set][index.ui],
                    units: this.answers.set2[index.set].textField
                },
                explanation: qas.filter(qa => qa.a !== "")
            }
        }).filter(d => d.explanation.length !== 0)

        const chartId = document.querySelector(".charts div").id
        setDataParagraph(write(dataParagraph), dataChart, chartId)
    }

    componentDidMount() {
        this.numberCols = [[]]
        this.string1Col = []
    }
    componentDidUpdate() {
        this.numberCols = this.props.dataChart.numberCols
    }

    render() {
        const { dataChart, dataCount, selectionInOrder} = this.props
        if (!dataChart || selectionInOrder.length === 0) { return null; }

        /* data */
        const { dataAnswer, dataSentence, dataQuestion } = this.props
        const { dateCol, numberCols, string1Col } = dataChart
        const numberColGroups = dataChart.keys
        this.selectionTasks = selectionInOrder.map(id => chartTasks[id])

        // TODO: to be more strict in data change comparison
        this.isDataChange = this.dataCount === undefined || Object.entries(dataCount).some(arr => {
            const key = arr[0]
            const val = arr[1]
            const preDataCount = this.dataCount
            return preDataCount[key] !== val
        })
        this.dataCount = dataCount

        if (this.isDataChange) {
            const keys = string1Col.length !== 0 ? string1Col : dateCol.map(date => date.toString())
            const keyType = string1Col.length !== 0 ? "number" : "date"
        
            this.dataStats = numberCols.map((col, idx) => {
                // params: col header, data, type of sumstats1, 2, 3, ///
                return summarize(
                    dataChart.keys[idx],
                    col.map((value, index) => ({ key: keys[index], value, keyType })),
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
                    select: [this.selectionTasks[0]]
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

        const selectComponent = (index, label) => {
            return (
                <TextField
                    key={"select-" + index}
                    select
                    label={label}
                    value={this.answers.set1.select[index]}
                    onChange={(event) => this.handleSets(event, "set1", "select", null, index)}
                    style={{ width: "100%" }}
                >
                    {this.selectionTasks.map((task, index) => (
                        <MenuItem key={index} value={task}>
                            {task}
                        </MenuItem>
                    ))}
                </TextField>
            )
        }

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
                        style={{ width: "100%", ...style }}
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
                <p className="question-set">Question set: charts</p>
                <div>{selectionInOrder.length > 1 ? selectComponent(0, "I would like to ") : <div>...</div>}</div>
                {/* switchComponent("Do you want to highlight the correlation between gdp and life expectancy?", this.answers.set1.switch, "set1", null, null, { marginTop: "8px" })}*/}

                <p className="question-set mb-5">Question set: statistical summary</p>
                {this.dataStats.map((dataList, idx) =>
                    <div key={"qh-" + idx} className="mb-5">
                        <p><span className="question-group">{numberColGroups[idx]}</span></p>
                        {textFieldComponent("What are the " + numberColGroups[idx] + " numbers referring to? (e.g. dollars, people, years ...)", this.answers.set2[idx].textField, "set2", idx)}
                        {dataList.map((data, i) => switchComponent(this.sumstatSentences.text[idx][i], this.answers.set2[idx].switch[i], "set2", idx, i))}
                    </div>
                )}

                <a href="#continue"><input
                    type="button"
                    className={"button btn-create mb-5 mt-15"}
                    value="Continue"
                    onClick={() => this.handleContinue()}
                    id="continue"
                /></a>

                {dataQuestion ? (dataQuestion.sentence.length !== 0 ?
                    dataQuestion.sentence.map((qs, idx) =>
                        <div key={"qh-" + idx}>
                            <p className="question-set mb-15">{"Follow up question set: " + parseInt(idx + 1) + "/" + followUpCount}</p>
                            {qs.map((q, i) => textFieldComponent(q, this.answers.set2FollowUp.textField[idx][i], "set2FollowUp", idx, i, 3))}
                        </div>) : <p className="instruction">There is no follow up questions</p>
                ) : null}
                {dataQuestion ? <input
                    type="button"
                    className={"button btn-create mb-5 mt-15"}
                    value="Submit"
                    onClick={() => this.handleSubmit()}
                /> : null}

                {/* <p className="question-set">Question set 3:</p> */}
                {/* {textFieldComponent("Are you focusing on some specific country or a group of them?", this.answers.set3.textField, "set3", null, null, 3)} */}
                {/* <ComponentSelectMultiple dataKeys={dataKeys} label="Are you focusing on some specific country or a group of them?" /> */}
                {/* {selectMultipleComponent("Are you focusing on some specific country or a group of them?")} */}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)