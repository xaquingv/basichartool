import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers, setQuestions, setParagraph } from '../../actions'
import { chartInfos } from '../../data/config';

/* summary statistics and nlg */
import { getSumStats } from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'
import write from '../../lib/write-data'

/* material ui and react ui */
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"
import Selects from './MuiSelects'
import ExpansionPanel from './MuiExpansionPanel'
import TextFieldWithAutocomplete from './MuiTextFieldAutocompletes'
import TextFields from './MuiTextFields'


const regAnyInCB = /{([^}]*)}/ // match 0 or more chars in {} (curly braces)
const sumstatTypes = ["min", "mean", "median", "max", "percentile2", "percentile98", "roi"] // roi -> regions of interest
const questionSet1 = {
    task: "I want to show ",
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

    handleSets(event, setId, uiType, indexSet = null, indexUi = null, id, ans, ss, tks, setData) {

        let newSentences;
        const selectedId = id || this.selectedId
        const answers = ans || this.answers
        const sentences = ss || this.sumstatSentences
        const tasks = tks || this.selectionTasks
        const value = (uiType === "switch" ? event.target.checked : event.target.value)

        // case: replace unit(s) with users input
        if (setId === "set1" && indexSet === "unit") {
            newSentences = { ...sentences }
        
            const replaceText = "{" + value + "}"
            const setSentences = (index) => {
                newSentences.edit[index] = newSentences.edit[index].map(s => s.replace(regAnyInCB, replaceText))
                newSentences.text[index] = newSentences.edit[index].map(s => s.replace(regAnyInCB, (value !== "" ? value : "{units}")))
            }
            
            // 1 or 3 dimensions depens on the data chart
            if (selectedId.includes("plot")) {
                setSentences(indexUi)
            } else {
                newSentences.edit.forEach((set, idx) => setSentences(idx))
            }
        }

        let newAnswers = { ...answers }
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
            const selectIndex = tasks.findIndex(task => task === value)
            const selectSelectionInOrder = this.props.selectionInOrder
            selectSelectionInOrder.forEach((select, index) => document.querySelector("#" + select).setAttribute("class", (index !== selectIndex) ? "order2" : "order1"))
            newAnswers.id = selectSelectionInOrder[selectIndex]
            // console.log(newAnswers.id, ":", value)
        }

        if (this) {
            this.props.setDataAnswer(newAnswers, newSentences)
        } else {
            setData(newAnswers, newSentences)
        }
    }

    handleSet2FollowUp(event, index1, index2) {
        const { setDataAnswer } = this.props
        const newAnswers = { ...this.answers }
        const newAnswerTextFields = newAnswers.set2FollowUp.textField
        newAnswerTextFields[index1][index2] = event.target.value
        setDataAnswer(newAnswers)
    }

    handleContinue() {
        const dataStatsFiltered = this.questions
            .map((question, index) => question
                .map((q, i) => ({
                    index: { set: index, ui: i },
                    explanation: q
                })).filter((s, i) => this.answers.set2[index].switch[i])
            ).flat()

        const questions = dataStatsFiltered.map(stats => stats.explanation/*.map(exp => exp.q)*/)
        const index = dataStatsFiltered.map(stats => stats.index)
        // console.log("q:", questions)

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
        this.answers = null
    }
    componentDidUpdate() {
        const { dataChart, dataCount, dataAnswer, selectionInOrder } = this.props
        this.numberCols = dataChart.numberCols
        this.selectedId = dataAnswer ? dataAnswer.id : selectionInOrder[0]
        this.dataCount = dataCount
        //console.log("cur:", dataAnswer)
        //console.log("pre:", this.answers)
        // if (!dataAnswer) this.props.setDataAnswer(this.answers)
    }

    // componentWillUnmount() {
    //     console.log()
    //     console.log("**** unmount ***")
    // }

    render() {

        const { selectionInOrder, dataAnswer } = this.props
        //console.log("* render ***")

        // require at leaset selectedId (elected chart id) to generate questions, and
        // it's default comes frmo the first chart in the selectionInOrder list
        if (selectionInOrder.length < 1) return null
        const selectedId = dataAnswer ? dataAnswer.id : selectionInOrder[0]
        //console.log("** data in the house:", selectedId, "***")

        /*
         * check if data is changed due to:
         * 1. init state (new) 
         * 2. change chart (Q.set1.1)
         * 3. update input data or toggle/transpaort table data
         */
        // TODO: to be more strict in data change comparison ?
        const curDataCount = this.props.dataCount
        const preDataCount = this.dataCount

        const isInit = dataAnswer ? false : true
        const isChangeId = selectedId !== this.selectedId
        const isUpdateData =
            Object.keys(curDataCount).some(key => curDataCount[key] !== preDataCount[key]) ||
            (this.answers ? !selectionInOrder.every((id, index) => id === this.answers.ids[index]) : true)

        const isDataChange = isInit || isChangeId || isUpdateData
        /*/ debug zone
        if (isInit) {
            console.log("==> init", isInit)
            // console.log("cur:", dataAnswer)
            // console.log("pre:", this.answers)
        }
        if (isChangeId) console.log("==> change id:", this.selectedId, "->", selectedId)
        if (isUpdateData) {
            console.log("==> update: data")
            // console.log("cur", selectionInOrder)
            // console.log("pre:", this.answers.ids)
        }*/

        /* data */
        const { dataChart, dataSentence, dataQuestion } = this.props
        const { keys, numberOnly, numberCols, dateFormat, col1Type, col1Header, col1ValuesToStrings } = dataChart
        if (isDataChange) {
            // TODO: refactory data flow
            this.answers = null

            /* questions in set2 */
            // use "string" instead of "string1"
            const col1DataType = col1Type.indexOf("str") > -1 ? "string" : col1Type 
            // remove the first col (or header) of data (types) if all values' type is number
            const colHeaders = numberOnly ? keys.slice(1) : keys 
            const sumstatCols = numberOnly ? numberCols.slice(1) : numberCols

            /* get sentences and questions back from the getSumStats
             * @params: {
             *   id: <string>,
             *   keys: {                    // col1
             *     type: <string>,          // values' data type
             *     header: <string>,
             *     values: Array<string>,   // values in string format
             *     format: <string>,        // date format or null
             *   },
             *   cols: [{                   // col(s) with number type, but the col1 if it's also with number type
             *     header: <string>,
             *     values: Array<Type>      // values
             *   }, ...]
             * } 
             */
            const dataSumstat = {
                id: selectedId,
                keys: {
                    type: col1DataType,
                    header: col1Header,
                    values: col1ValuesToStrings,
                    format: dateFormat,   
                },
                cols: sumstatCols.map((colValues, index) => ({
                    header: colHeaders[index],
                    values: colValues
                }))
            }
            const sumStats = getSumStats(dataSumstat)
            this.questions = sumStats.questions
            
            const sentences = sumStats.sentences
            this.sumstatSentences = {
                edit: sentences,
                text: sentences // keep a text copy to replace unit string
            }
            // console.log("s:", sentences)

            // TODO: check, not only answers !?
            /* answers in all sets */
            // selectionTasks: used in Q.set1.1 is required in handleSets() 
            this.selectionTasks = selectionInOrder.map(id => chartInfos[id].task)

            this.answers = {
                id: selectedId,
                ids: selectionInOrder,
                set1: {
                    task: { select: [this.selectionTasks[0]] },
                    unit: { textField: ["", "", ""] },
                    draw: {
                        select: ["default"],
                        textField: ""
                    }
                },
                set2: sentences.map(group => ({
                    textField: "",
                    switch: group.map(s => false/*true*/)
                })),
                set2FollowUp: { textField: [] },
                // set3: { textField: "" }
            }
            //console.log(this.answers)

        } else {
            this.answers = dataAnswer || this.answers
            this.sumstatSentences = dataSentence || this.sumstatSentences
        }

        /* ui components */
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


        /* draw * /
        if (this.answers) {
            console.log("*** ui up running ***")
            console.log("")
        }*/
        const numberColGroups = dataChart.keys
        const followUpCount = dataQuestion ? dataQuestion.sentence.length : 0
        if (dataQuestion) {
            //console.log("f:", dataQuestion)
        }
        return this.answers ? (
            <div className="questions">
                {/* Set1 Questions */}
                <p className="question-set">{"Question set: chart " + this.answers.id}</p>
                
                {/* Q1: task of the chart and more info */}
                {selectionInOrder.length > 1 ? <div>
                    {selectComponent(0, "task", questionSet1.task, this.selectionTasks)}
                    <ExpansionPanel info={chartInfos[this.answers.id].description} />
                </div> : null}

                {/* Q2: axis and size for plots */}
                {this.answers.id.includes("plot") ?
                    <Selects question={questionSet1.axis} options={numberColGroups} labels={["x-axis", "y-axis", "size"]} /> :
                    null
                }

                {/* Q3: unit(s) of number(s), x3 if plots */}
                {/* @param: label, value, setId, indexSet = null, indexUi = null */}
                {/* TODO: selects change to textfields */}
                {!this.answers.id.includes("plot") ?
                    textFieldComponent(questionSet1.unit, this.answers.set1.unit.textField[0], "set1", "unit", 0) :
                    <TextFields 
                        question={questionSet1.unit} labels={numberColGroups} placeholder={questionSet1.placeholder} 
                        handleChange={this.handleSets} params={["set1", "unit", this.selectedId]} 
                        answers={this.answers} ss={this.sumstatSentences} tasks={this.selectionTasks}
                        setAnswers={this.props.setDataAnswer}
                    />
                }

                {/* Q5: line highlights */}
                {this.answers.id.includes("line") ?
                    <TextFieldWithAutocomplete question={questionSet1.auto.multi} options={numberColGroups} renderType={"multiple"} 
                        handleChange={this.handleSet2QuestionsFilter} 
                    /> :
                    null
                }

                {/* Q6: stack drawing order */}
                {this.answers.id.includes("Stack") ? <div className="d-f">
                    {selectComponent(0, "draw", questionSet1.draw.type, questionSet1.draw.opts)}
                    {this.answers.set1.draw.select[0] === questionSet1.draw.opts[2] ?
                        <TextFieldWithAutocomplete question={questionSet1.auto.single} options={numberColGroups} renderType={"single"} /> :
                        null}
                </div> : null}


                {/* Set2 Questions */}
                <p className="question-set mb-5">Question set: statistical summary</p>
                {/* grouped sentences for toggle */}
                {this.sumstatSentences.text.map((sentence, idx) =>
                    <div key={"qh-" + idx} className="mb-5 js-set2Q" id={numberColGroups[idx].replace(/ /g,'')}>
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
                
                {/* follow-up questions */}
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
