import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setAnswers, setQuestions, setParagraph, setChartId, setAxisMapper, setDrawingOrder } from '../../actions'
import { chartInfos } from '../../data/config';

/* summary statistics and nlg */
import { getSumStats } from '../../lib/sumstats'
import write from '../../lib/write-data'

/* material ui and react ui */
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"
// import Selects from './MuiSelect'
import SelectSimple from './MuiSelects'
import ExpansionPanel from './MuiExpansionPanel'
import TextFieldWithAutocomplete from './MuiTextFieldAutocompletes'
import TextFields from './MuiTextField'


const regAnyInCB = /{([^}]*)}/ // match 0 or more chars in {} (curly braces)
const questionSet1 = {
    draw: {
        type: "What order would you like to this stack chart?",
        opts: ["as is.", "starting by largest.", "starting with ..."],
    }
}
const optDrawing = [
    {key: 0, txt: "as is."},
    {key: 1, txt: "starting by largest."},
    {key: 2, txt: "starting with ..."}
]

const mapStateToProps = state => ({
    chartId: state.chartId,
    dataCount: state.dataCount,
    dataChart: state.dataChart,
    axisMapper: state.axisMapper,
    drawingOrder: state.drawingOrder,
    dataAnswer: state.dataAnswer,
    dataSentence: state.dataSentence,
    dataQuestion: state.dataQuestion,
    selection: state.selection
})

const mapDispatchToProps = dispatch => ({
    setDataAnswer: (answers, sentences) => dispatch(setAnswers(answers, sentences)),
    setDataQuestion: questions => dispatch(setQuestions(questions)),
    setDataParagraph: (paragraph, chart, id) => dispatch(setParagraph(paragraph, chart, id)),
    // selects
    setSelectedChartId: id => dispatch(setChartId(id)),
    setPlotAxisMapper: mapping => dispatch(setAxisMapper(mapping)),
    setStackDrawingOrder: mapping => dispatch(setDrawingOrder(mapping))
})


class Questions extends React.PureComponent {

    handleSets(event, setId, uiType, indexSet = null, indexUi = null, id, ans, ss, setData) {

        let newSentences;
        const answers = ans || this.answers
        const sentences = ss || this.sumstatSentences
        const value = (uiType === "switch" ? event.target.checked : event.target.value)

        // case: replace unit(s) with users input
        if (setId === "set1" && indexSet === "unit") {
            newSentences = { ...sentences }
            const replaceText = "{" + value + "}"
            const setSentences = (index) => {
                newSentences.edit[index] = newSentences.edit[index].map(s => s.replace(regAnyInCB, replaceText))
                newSentences.text[index] = newSentences.edit[index].map(s => s.replace(regAnyInCB, (value !== "" ? value : "{units}")))
            }
            setSentences(indexUi)
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

        if (this) {
            this.props.setDataAnswer(newAnswers, newSentences)
        } else {
            setData(newAnswers, newSentences)
        }
    }

    handleSet2FollowUp(event, index) {
        const newAnswers = { ...this.answers }
        newAnswers.set2FollowUp.textField[index[0]][index[1]][index[2]] = event.target.value
        this.props.setDataAnswer(newAnswers)
    }

    // handleSubmit() {
    //     const { dataQuestion, setDataParagraph, dataChart } = this.props
    //     const newQuestionAnswer = this.answers.set2FollowUp.textField.map((as, idx) => as.map((a, i) => ({ a, q: dataQuestion.sentence[idx][i] })))
    //     const dataParagraph = newQuestionAnswer.map((qas, i) => {
    //         const index = dataQuestion.index[i]
    //         return {
    //             //index: index,
    //             data: {
    //                 ...this.dataStats[index.set][index.ui],
    //                 units: this.answers.set2[index.set].textField
    //             },
    //             explanation: qas.filter(qa => qa.a !== "")
    //         }
    //     }).filter(d => d.explanation.length !== 0)

    //     const chartId = document.querySelector(".charts div").id
    //     //console.log(dataParagraph)
    //     setDataParagraph(write(dataParagraph), dataChart, chartId)
    // }

    // handleChartId(event) {
    //     const chartId = event.target.value
    //     console.log("change chart id:", chartId, this.props)
    //     this.props.setSelectedChartId(chartId)
    // }

    componentDidMount() {
        this.string1Col = []
        this.numberCols = [[]]
        this.answers = null
    }
    componentDidUpdate() {
        const { chartId, dataChart, dataCount } = this.props
        this.numberCols = dataChart.numberCols
        this.chartId = chartId
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
        const { chartId, selection, axisMapper, drawingOrder, dataAnswer, setSelectedChartId, setPlotAxisMapper, setStackDrawingOrder } = this.props
        
        // require at leaset chartId to generate questions
        if (!chartId) { return null; }
        console.log("render step 2: qa -", chartId)

        /*
         * check if data is changed due to:
         * 1. init state (new) 
         * 2. change chart (Q.set1.1)
         * 3. update input data or toggle/transpaort table data
         */
        // TODO: to be more strict in data change comparison ?
        //const curDataCount = this.props.dataCount
        //const preDataCount = this.dataCount
        //console.log(curDataCount, preDataCount)

        const isInit = dataAnswer ? false : true
        const isChangeId = chartId !== this.chartId
        const isUpdateData =
            //Object.keys(curDataCount).some(key => curDataCount[key] !== preDataCount[key]) ||
            (this.answers ? !selection.every((id, index) => id === this.answers.ids[index]) : true)

        const isDataChange = isInit || isChangeId || isUpdateData
        /*/ debug zone
        if (isInit) {
            console.log("==> init", isInit)
            // console.log("cur:", dataAnswer)
            // console.log("pre:", this.answers)
        }
        if (isChangeId) console.log("==> change id:", this.chartId, "->", chartId)
        if (isUpdateData) {
            console.log("==> update: data")
            // console.log("cur", selection)
            // console.log("pre:", this.answers.ids)
        }*/

        /* data */
        const { dataChart, dataSentence, dataQuestion } = this.props
        const { keys, numberOnly, numberCols, dateFormat, col1Type, col1Header, col1ValuesToStrings } = dataChart
        // use "string" instead of "string1"
        const col1DataType = col1Type.indexOf("str") > -1 ? "string" : col1Type
        /* questions in set2 */
        // remove the first col (or header) of data (types) if all values' type is number
        const colHeaders = numberOnly ? keys.slice(1) : keys
        const sumstatCols = numberOnly ? numberCols.slice(1) : numberCols
        if (isDataChange) {
            // TODO: refactory data flow
            this.answers = null

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
                id: chartId,
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
            // console.log(this.questions)

            const sentences = sumStats.sentences
            this.sumstatSentences = {
                edit: sentences,
                text: [...sentences] // keep a text copy to replace unit string
            }
            // console.log("s:", sentences)

            // TODO: check, not only answers !?
            /* answers in all sets */

            this.answers = {
                // id: chartId,
                ids: selection,
                set1: {
                    unit: { textField: ["", "", ""] },
                    draw: {
                        // select: ["as is."],
                        textField: ""
                    },
                    cols: { textField: [""] }
                },
                set2: sentences.map(group => ({
                    textField: "",
                    switch: group.map(() => false)
                })),
                set2FollowUp: { 
                    textField: this.questions.map((group) => 
                        group.map((qs) => 
                            qs.map(() => "")
                    ))
                },
            }
            //console.log(this.answers)

        } else {
            this.answers = dataAnswer || this.answers
            this.sumstatSentences = dataSentence || this.sumstatSentences
        }

        /* ui components */
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

        const textFieldComponent = (label, value, index) => {
            return (
                <div key={"tf-" + index.join("")}>
                    <TextField
                        multiline
                        label={label}
                        rowsMax={3}
                        value={value}
                        placeholder="Please type your answer here, or leave it empty to skip."
                        onChange={(event) => 
                            // setId !== "set2FollowUp" ?
                            // this.handleSets(event, setId, "textField", indexSet, indexUi) :
                            this.handleSet2FollowUp(event, index)
                        }
                        margin="normal"
                        style={{width: "66%", minWidth: "600px", marginTop: "5px", marginLeft: "46px"}}
                        InputLabelProps={{ shrink: true, }}
                    />
                </div>
            )
        }


        /* draw */
        const numberColGroups = dataChart.keys
        const numberColGroupsCount = numberColGroups.length
        const numberColHeader = numberColGroupsCount > 3 ? (numberColGroups.slice(0, 3).join(", ") + ", ...") : numberColGroups.join(", ")
        // if (this.answers) {
        //     // console.log("*** ui up running ***")
        //     // console.log("")
        //     // console.log(numberColGroups)
        // }
        
        if (!this.answers) { return null; }
        // selects
        const optSelection = selection.map(id => ({key: id, txt: chartInfos[id].task}))
        const optHeaders = numberColGroups.map((header, index) => ({key: index, txt: header}))
        // text fields
        // ...
        return (
            <div className="questions f-18">
                {/* Set1 Questions */}
                <p className="question-set">{"Question set: chart " + chartId}</p>

                {/* Q1: task of the chart and more info */}
                {selection.length > 1 ? <div style={{marginBottom: '-18px'}}>
                    <div className="q-set1-pb6">I want to&nbsp;<b>show</b>&nbsp;</div>
                    <SelectSimple qaId="S1Q1" options={optSelection} value={chartId} setChange={setSelectedChartId} />
                    <ExpansionPanel info={chartInfos[chartId].description} />
                </div> : null}

                {/* Q2: axis and size for plots */}
                {/* TODO: loop optHeaders instead */}
                {chartId.includes("plot") ? <div>
                    <div className="q-set1-pb6">So use the&nbsp;<b>x-axis</b>&nbsp;for&nbsp;</div>
                    <SelectSimple qaId="S1Q2" options={optHeaders} value={axisMapper[0]} setChange={setPlotAxisMapper} data={axisMapper}/>
                    <div className="q-set1-pb6">,&nbsp;<b>y-axis</b>&nbsp;for&nbsp;</div>
                    <SelectSimple qaId="S1Q2" options={optHeaders} value={axisMapper[1]} setChange={setPlotAxisMapper} data={axisMapper}/>
                    {numberColGroupsCount > 2 ? <div className="q-set1-pb6">, and&nbsp;<b>size</b>&nbsp;for&nbsp;</div> : null}
                    {numberColGroupsCount > 2 ? <SelectSimple qaId="S1Q2" options={optHeaders} value={axisMapper[2]} setChange={setPlotAxisMapper} data={axisMapper}/> : null}
                </div> : null}

                {/* Q3: unit(s) of number(s), x3 if plots */}
                {/* @param: label, value, setId, indexSet = null, indexUi = null */}
                <div>
                    <div className="q-set1-pb11">The numbers on the table refer to&nbsp;</div>
                    <TextFields
                        index={0} helpText={chartId.includes("plot") ? numberColGroups[0] : numberColHeader} placeholder={"required*"}
                        handleChange={this.handleSets} params={["set1", "unit", chartId]}
                        answers={this.answers} ss={this.sumstatSentences}
                        setAnswers={this.props.setDataAnswer}
                    />
                    {chartId.includes("plot") ? <span>,{' '}</span> : null}
                    {chartId.includes("plot") ?
                        <TextFields
                            index={1} helpText={numberColGroups[1]} placeholder={"required*"}
                            handleChange={this.handleSets} params={["set1", "unit", chartId]}
                            answers={this.answers} ss={this.sumstatSentences}
                            setAnswers={this.props.setDataAnswer}
                        /> : null
                    }
                    {chartId.includes("plot") && numberColGroupsCount === 3 ? <span>,{' and '}</span> : null}
                    {chartId.includes("plot") && numberColGroupsCount === 3 ?
                        <TextFields
                            index={2} helpText={numberColGroups[2]} placeholder={"required*"}
                            handleChange={this.handleSets} params={["set1", "unit", chartId]}
                            answers={this.answers} ss={this.sumstatSentences}
                            setAnswers={this.props.setDataAnswer}
                        /> : null
                    }
                    <div>-- is it $/€/£, people, or years?</div>
                </div>

                {/* Q4: header of number cols */}
                {col1DataType !== "date" ? <div>
                    <div className="q-set1-pb11">{numberColHeader[0].toUpperCase() + numberColHeader.slice(1) + ' are'}&nbsp;</div>
                    <TextFields
                        index={0} helpText={""} placeholder={col1Header}
                        handleChange={this.handleSets} params={["set1", "cols", chartId]}
                        answers={this.answers} ss={this.sumstatSentences}
                        setAnswers={this.props.setDataAnswer}
                    />
                </div > : null}

                {/* Q5: stack drawing order */}
                {chartId.includes("Stack") ? <div>
                    <div className="q-set1-pb6">And&nbsp;<b>stack</b>&nbsp;the chart&nbsp;</div>
                    <SelectSimple qaId="S1Q5" options={optDrawing} value={drawingOrder} setChange={setStackDrawingOrder} />
                    <span>{' '}</span>
                    {drawingOrder === 2 ?
                        <TextFieldWithAutocomplete question={""} options={numberColGroups} renderType={"single"} /> :
                        null}
                </div> : null}

                {/* Q6: line highlights */}
                {chartId.includes("line") && numberColGroupsCount > 3 ? <div className="d-f">
                    <div className="as-fe pb-4">And&nbsp;<b>highlight</b>&nbsp;</div>
                    <TextFieldWithAutocomplete question={""} options={numberColGroups} renderType={"multiple"}
                        handleChange={this.handleSet2QuestionsFilter}
                    /> 
                </div> : null}

                {/* Set2 Questions */}
                {/* <p className="question-set mb-5">Question set: statistical summary</p>
                {/* grouped sentences for toggle * /}
                {this.sumstatSentences.text.map((sentences, index) =>
                    <div key={"qh-" + index} className="mb-5 js-set2Q" id={numberColGroups[index].replace(/ /g, '')}>
                        <p><span className="question-group">{numberColGroups[index]}</span></p>
                        {sentences.map((s, idx) => <div>
                            {switchComponent(s, this.answers.set2[index].switch[idx], "set2", index, idx)}
                            {this.answers.set2[index].switch[idx] ?
                                this.questions[index][idx].map((q, i) => textFieldComponent(q, this.answers.set2FollowUp.textField[index][idx][i], [index, idx, i])) 
                            : null}
                        </div>)}
                    </div>
                )} */}

                {/* {dataQuestion ? <input
                    type="button"
                    className={"button btn-create mb-5 mt-15"}
                    value="Submit"
                    onClick={() => this.handleSubmit()}
                /> : null} */}

            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)
