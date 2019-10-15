import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers, setQuestions, setParagraph } from '../../actions'
import { chartInfos } from '../../data/config';

/* summary statistics and nlg */
import { summarize } from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'
import write from '../../lib/write-data'

/* material ui and react ui */
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"
import Selects from './MuiSelects'
import ExpansionPanel from './MuiExpansionPanel'
import TextFieldWithAutocomplete  from './MuiTextFieldAutocompletes'
import TextFields from './MuiTextFields'


const regAnyInCB = /{([^}]*)}/ // match 0 or more chars in {} (curly braces)
const typeSumstats = ["min", "mean", "median", "max", "percentile2", "percentile98", "roi"] // roi -> regions of interest
const questionSet1 = {
    task: "I would like to ",
    axis: "What is the axis (and size) mapping with?",
    unit: "What are the numbers referring to? (e.g. dollars, people, years ...)",
    line: "",
    draw: {
        type: "What order would you like to this stack chart?",
        opts: ["default", "biggest", "specific*"],
    },
    auto: {
        multi: 'Which line(s) wouild you like to highlight?',
        single: 'Which specific* one?'
    },
    placeholder: "Please type your answer here ..."
}


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

        // console.log("[setId]   :", setId)
        // console.log("[indexSet]:", indexSet)
        // console.log("[uiType]  :", uiType)
        // console.log("[indexUi] :", indexUi)
        // console.log(value)
        
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

        // TODO: debug, check on https://reactjs.org/docs/forms.html#controlled-components
        // update selection order and add border to the first chart
        if (setId === "set1" && indexSet === "task") {
            const selectIndex = this.selectionTasks.findIndex(task => task === value)
            const selectSelectionInOrder = this.props.selectionInOrder
            selectSelectionInOrder.forEach((select, index) => document.querySelector("#" + select).setAttribute("class", (index !== selectIndex) ? "order2" : "order1"))
            newAnswers.id = selectSelectionInOrder[selectIndex]
            // console.log(newAnswers.id, ":", value)
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
        this.string1Col = []
        this.numberCols = [[]]
        this.answers = {}
    }
    componentDidUpdate() {
        const { dataChart, dataCount, dataAnswer, selectionInOrder } = this.props
        this.numberCols = dataChart.numberCols
        this.selectedId = dataAnswer ? dataAnswer.id : selectionInOrder[0]
        this.dataCount = dataCount
    }

    render() {
        const { dataChart, dataCount, selectionInOrder} = this.props
        if (!dataChart || selectionInOrder.length === 0) { return null; }

        /* data */
        const { dataAnswer, dataSentence, dataQuestion } = this.props
        const { dateCol, numberCols, string1Col } = dataChart
        const numberColGroups = dataChart.keys
        const selectedId = dataAnswer ? dataAnswer.id : selectionInOrder[0] 
        this.selectionTasks = selectionInOrder.map(id => chartInfos[id].task)

        // TODO: to be more strict in data change comparison
        // init 
        const isInit = !dataAnswer === undefined
        // update data or table
        const isChangeId = selectedId !== this.selectedId
        // update set1 questions
        const isChangeCounts = Object.entries(dataCount).some(arr => {
            const key = arr[0]
            const val = arr[1]
            const preDataCount = this.dataCount
            return preDataCount[key] !== val
        })
        this.isDataChange = isInit || isChangeCounts || isChangeId
        // debug zone
        if (isInit) console.log("=> data changed: init")
        else if (isChangeId) console.log("=> data changed:", this.selectedId, "->", selectedId)
        else if (isChangeCounts) console.log("=> data changed: counts")
        // console.log(selectionInOrder[0], "(init)")
        // console.log(dataAnswer? dataAnswer.id : selectionInOrder[0], "(cur)")
        // console.log(this.selectedId, "(pre)")

        if (this.isDataChange) {
            // TODO: refactory data flow
            this.answers = null

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
                id: selectedId,
                set1: {
                    task: { select: [this.selectionTasks[0]] },
                    unit: { textField: [""] },
                    draw: { select: ["default"], textField: "" }
                },
                set2: this.dataStats.map(group => ({ 
                    textField: "", 
                    switch: group.map(s => false/*true*/) 
                })),
                set2FollowUp: { textField: [] },
                set3: { textField: "" }
            }
            // console.log(this.answers)
        } else {
            this.answers = dataAnswer || this.answers
            this.sumstatSentences = dataSentence || this.sumstatSentences
        }
        // if (this.answers) {
        //     console.log("stack?", this.answers.id)
        //     console.log("specific?", this.answers.set1.draw.select)
            // console.log(dataCount.number)
            // console.log(numberColGroups)
        // }

        const selectComponent = (index, type, label, options) => {
            return (
                <TextField
                    key={"select-" + index}
                    select
                    label={label}
                    value={this.answers.set1[type]["select"][index]}
                    onChange={(event) => this.handleSets(event, "set1", "select", type, index)}
                    style={{ width: "100%" }}
                >
                    {options.map((opt, index) => (
                        <MenuItem key={index} value={opt}>
                            {opt}
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

        const followUpCount = dataQuestion ? dataQuestion.sentence.length : 0
        return this.answers ? (
            <div className="questions">
                <p className="question-set">{"Question set: chart " + this.answers.id}</p>
                {/* Q1: task of the chart and more info */}
                {selectionInOrder.length > 1 ? <div>
                    {selectComponent(0, "task", questionSet1.task, this.selectionTasks)}
                    <ExpansionPanel info={chartInfos[this.answers.id].description}/>
                </div> : null}

                {/* Q2: axis and size for plots */}
                {this.answers.id.includes("plot") ? 
                    <Selects header={questionSet1.axis} options={numberColGroups} labels={["x-axis", "y-axis", "size"]} /> : 
                    null
                }

                {/* Q3: unit(s) of number(s), x3 if plots */}
                {/* @param: label, value, setId, indexSet = null, indexUi = null */}
                {/* TODO: selects change to textfields */}
                {!this.answers.id.includes("plot") ? 
                    textFieldComponent(questionSet1.unit, this.answers.set1.unit.textField, "set1", "unit", 0) :
                    <TextFields header={questionSet1.unit} placeholder={questionSet1.placeholder} labels={numberColGroups}/>
                }

                {/* Q4: line highlights */} 
                {this.answers.id.includes("line") ? 
                   <TextFieldWithAutocomplete suggestions={numberColGroups} renderType={"multiple"} label={questionSet1.auto.multi} /> :
                   null
                }

                {/* Q5: stack drawing order */}
                {this.answers.id.includes("Stack") ? <div className="d-f">
                    {selectComponent(0, "draw", questionSet1.draw.type, questionSet1.draw.opts)}
                    {this.answers.set1.draw.select[0] === questionSet1.draw.opts[2] ?
                        <TextFieldWithAutocomplete suggestions={numberColGroups} renderType={"single"} label={questionSet1.auto.single} /> :
                    null}
                </div> : null}

                <p className="question-set mb-5">Question set: statistical summary</p>
                {this.dataStats.map((dataList, idx) =>
                    <div key={"qh-" + idx} className="mb-5">
                        <p><span className="question-group">{numberColGroups[idx]}</span></p>
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
        ) : null
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)