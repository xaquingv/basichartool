import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setChartId, setAxisMapper, setDrawingOrder, setAnswers, setQuestionSentences, setParagraph } from '../../actions'
import { chartInfos } from '../../data/config';

/* summary statistics and nlg */
import { getSumStats } from '../../lib/sumstats'
import write from '../../lib/write-data'

/* material ui and react ui */
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import SwitchLabel from './MuiSwitch'
import SelectSimple from './MuiSelects'
import ExpansionPanel from './MuiExpansionPanel'
import TextFields from './MuiTextField'
import TextFieldWithAutocomplete from './MuiTextFieldAutocompletes'


const optDrawing = [
    { key: 0, txt: "as is." },
    { key: 1, txt: "starting by largest." },
    { key: 2, txt: "starting with ..." }
]

const mapStateToProps = state => ({
    chartId: state.chartId,
    selection: state.selection,
    dataCount: state.dataCount,
    dataChart: state.dataChart,
    // dataSumstat
    dataSentence: state.dataSentence,
    dataQuestion: state.dataQuestion,
    // dataAnswerSet2
    dataAnswer: state.dataAnswer,
    // dataAnswerSet1
    axisMapper: state.axisMapper,
    drawingOrder: state.drawingOrder
})

const mapDispatchToProps = dispatch => ({
    // set1 selects
    setSelectedChartId: id => dispatch(setChartId(id)),
    setPlotAxisMapper: mapping => dispatch(setAxisMapper(mapping)),
    setStackDrawingOrder: mapping => dispatch(setDrawingOrder(mapping)),
    // set2
    setDataSentenceQuestion: (sentences, questions) => dispatch(setQuestionSentences(sentences, questions)),
    setDataAnswer: (answers) => dispatch(setAnswers(answers)),
    setDataParagraph: (paragraph, chart, id) => dispatch(setParagraph(paragraph, chart, id))
})


class Questions extends React.PureComponent {

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

    componentDidMount() {
        this.answers = null
    }
    componentDidUpdate() {
        const { chartId, dataCount } = this.props
        this.chartId = chartId
        this.dataCount = dataCount
        //console.log("cur:", dataAnswer)
        //console.log("pre:", this.answers)
        // if (!dataAnswer) this.props.setDataAnswer(this.answers)
    }

    render() {
        const { chartId, selection, axisMapper, drawingOrder, dataSentence, dataQuestion, dataAnswer } = this.props

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
        console.log(dataSentence)
        console.log(dataAnswer)
        const isInit = dataSentence || dataAnswer ? false : true
        const isChangeId = chartId !== this.chartId
        const isUpdateData =
            //Object.keys(curDataCount).some(key => curDataCount[key] !== preDataCount[key]) ||
            (this.answers ? !selection.every((id, index) => id === this.answers.ids[index]) : true)

        const isDataChange = isInit || isChangeId || isUpdateData
        // debug zone
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
        }

        /* data */
        const { dataChart } = this.props
        const { keys, numberOnly, numberCols, dateFormat, col1Type, col1Header, col1ValuesToStrings } = dataChart
        // use "string" instead of "string1"
        const col1DataType = col1Type.indexOf("str") > -1 ? "string" : col1Type
        /* questions in set2 */
        // remove the first col (or header) of data (types) if all values' type is number
        const colHeaders = numberOnly ? keys.slice(1) : keys
        const sumstatCols = numberOnly ? numberCols.slice(1) : numberCols

        let sumstatSentences, sumstatQuestions
        if (isDataChange) {
            // TODO: refactory data flow
            //this.answers = null

            // get sentences and questions back from the getSumStats
            const dataSumstat = {                   // @params:
                id: chartId,                        // <string> 
                // col1
                keys: {
                    type: col1DataType,             // <string>: values' data type
                    header: col1Header,             // <string>
                    values: col1ValuesToStrings,    // Array<string>: values in string format
                    format: dateFormat,             // <string>: date format or null
                },
                // col(s) with number type, but the col1 if it's also with number type
                cols: sumstatCols.map((colValues, index) => ({
                    header: colHeaders[index],      // <string> 
                    values: colValues               // Array<Type>: values 
                }))
            }
            const sumStats = getSumStats(dataSumstat)
            sumstatSentences = sumStats.sentences
            sumstatQuestions = sumStats.questions
            this.sentences = {
                text: sumstatSentences,     // display text
                edit: [...sumstatSentences] // edit copy to know where to replace the unit* string
            }
            this.questions = {
                text: sumstatQuestions,
                edit: [...sumstatQuestions]
            }

            // TODO: check, not only answers !?
            // answers in set 2
            this.answers = {
                ids: selection,
                // TODO: change to switches and remove textfield
                switches: sumstatSentences.map(group =>
                    group.map(() => false)
                ),
                textfields: sumstatQuestions.map(group =>
                    group.map(qs =>
                        qs.map(() => "")
                    ))
            }
            //console.log(this.answers)

        } else {
            this.answers = dataAnswer || this.answers
            this.sentences = dataSentence || this.sentences
            this.questions = dataQuestion || this.questions
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
        const {setSelectedChartId, setPlotAxisMapper, setStackDrawingOrder, setDataSentenceQuestion, setDataAnswer} = this.props
        const isPlot = chartId.includes("plot")
        // selects
        const optSelection = selection.map(id => ({ key: id, txt: chartInfos[id].task }))
        const optHeaders = numberColGroups.map((header, index) => ({ key: index, txt: header }))
        return (
            <div className="questions f-18">
                {/* Set1 Questions */}
                <p className="question-set">{"Question set: chart " + chartId}</p>

                {/* Q1: task of the chart and more info */}
                {selection.length > 1 ? <div style={{ marginBottom: '-18px' }}>
                    <div className="q-set1-pb6">I want to&nbsp;<b>show</b>&nbsp;</div>
                    <SelectSimple
                        qaId="S1Q1" options={optSelection} value={chartId}
                        setChange={setSelectedChartId}
                    />
                    <ExpansionPanel info={chartInfos[chartId].description} />
                </div> : null}

                {/* Q2: axis and size for plots */}
                {/* TODO: loop optHeaders instead ? */}
                {isPlot ? <div>
                    <div className="q-set1-pb6">So use the&nbsp;<b>x-axis</b>&nbsp;for&nbsp;</div>
                    <SelectSimple
                        qaId="S1Q2" options={optHeaders} value={axisMapper[0]}
                        setChange={setPlotAxisMapper} data={axisMapper}
                    />
                    <div className="q-set1-pb6">,&nbsp;<b>y-axis</b>&nbsp;for&nbsp;</div>
                    <SelectSimple
                        qaId="S1Q2" options={optHeaders} value={axisMapper[1]}
                        setChange={setPlotAxisMapper} data={axisMapper}
                    />
                    {numberColGroupsCount > 2 ? <div className="q-set1-pb6">, and&nbsp;<b>size</b>&nbsp;for&nbsp;</div> : null}
                    {numberColGroupsCount > 2 ? <SelectSimple
                        qaId="S1Q2" options={optHeaders} value={axisMapper[2]}
                        setChange={setPlotAxisMapper} data={axisMapper}
                    /> : null}
                </div> : null}

                {/* Q3: unit(s) of number(s), x3 if plots */}
                <div>
                    <div className="q-set1-pb11">The numbers on the table refer to&nbsp;</div>
                    {isPlot ?
                        <TextFields
                            helpText={numberColGroups[0]}
                            setChange={setDataSentenceQuestion}
                            data={{ sentences: this.sentences, questions: this.questions, index: 0 }}
                        /> :
                        <TextFields
                            helpText={numberColHeader}
                            setChange={setDataSentenceQuestion}
                            data={{ sentences: this.sentences, questions: this.questions, isOnlyTF: true }}
                        />
                    }
                    {isPlot ? <span>,{' '}</span> : null}
                    {isPlot ?
                        <TextFields
                            helpText={numberColGroups[1]}
                            setChange={setDataSentenceQuestion}
                            data={{ sentences: this.sentences, questions: this.questions, index: 1 }}
                        /> : null
                    }
                    {isPlot && numberColGroupsCount === 3 ? <span>,{' and '}</span> : null}
                    {isPlot && numberColGroupsCount === 3 ?
                        <TextFields
                            helpText={numberColGroups[2]}
                            setChange={setDataSentenceQuestion}
                            data={{ sentences: this.sentences, questions: this.questions, index: 2 }}
                        /> : null
                    }
                    <div>-- is it $/€/£, people, or years?</div>
                </div>

                {/* Q4: header of number cols */}
                {col1DataType !== "date" ? <div>
                    <div className="q-set1-pb11">{numberColHeader[0].toUpperCase() + numberColHeader.slice(1) + ' are'}&nbsp;</div>
                    <TextFields defaultValue={col1Header} />
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

                {/* Set2 Questions: <switch> sentences and questions/answers <textfield>*/}
                <p className="question-set mb-5">Question set: statistical summary</p>
                {/* grouped sentences for toggle */}
                {this.sentences.text.map((sentences, index) =>
                    <div key={"qh-" + index} className="mb-5 js-set2Q" id={numberColGroups[index].replace(/ /g, '')}>
                        <p><span className="question-group">{numberColGroups[index]}</span></p>
                        {sentences.map((s, idx) => <div>
                            <SwitchLabel 
                                label={s} checked={this.answers.switches[index][idx]} 
                                setChange={setDataAnswer} data={{answers: this.answers, index: [index, idx]}}
                            />
                            {this.answers.switches[index][idx] ?
                                this.questions.text[index][idx].map((q, i) =>
                                    <TextFields
                                        qaId="set2" label={q}
                                        setChange={setDataAnswer} data={{ answers: this.answers, index: [index, idx, i] }} 
                                    />
                                )
                                : null
                            }
                        </div>)}
                    </div>
                )}

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
