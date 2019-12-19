import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import { setChartId, setAxisMapper, setDrawingOrder, setHighlights, setAnswers, setQuestionSentences, setParagraph, setSumstat } from '../../actions'
import { chartInfos } from '../../data/config';

/* summary statistics and nlg */
import { getSumStats } from '../../lib/sumstats'
// import write from '../../lib/write-data'

/* material ui and react ui */
import SwitchLabel from './MuiSwitch'
import SelectSimple from './MuiSelects'
import ExpansionPanel from './MuiExpansionPanel'
import TextFields from './MuiTextField'
import Autocomplete from './MuiAutocomplete'
// import Collapse from '@material-ui/core/Collapse';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#156ca6",
        }
    },
    typography: {
        fontFamily: ["source-sans-pro", "Helvetica", "Arial", "sans-serif"].join(','),
        // body1: { fontSize: '1.125rem' },
    },
});

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
    dataSetup: state.dataSetup,
    // Set1: dataAnswerSet1
    axisMapper: state.axisMapper,
    drawingOrder: state.drawingOrder,
    lineHighlights: state.lineHighlights,
    // Set2: dataSumstat and dataAnswer
    dataSentence: state.dataSentence,
    dataQuestion: state.dataQuestion,
    dataAnswer: state.dataAnswer
})

const mapDispatchToProps = dispatch => ({
    // set1 selects
    setSelectedChartId: id => dispatch(setChartId(id)),
    setPlotAxisMapper: mapping => dispatch(setAxisMapper(mapping)),
    setStackDrawingOrder: order => dispatch(setDrawingOrder(order)),
    setLineHighlights: (highlights, colors) => dispatch(setHighlights(highlights, colors)),
    // set2
    setDataAnswer: answers => dispatch(setAnswers(answers)),
    setDataSentenceQuestion: (sentences, questions) => dispatch(setQuestionSentences(sentences, questions)),
    setDataSumstat: (sentences, questions, answers, highlights) => dispatch(setSumstat(sentences, questions, answers, highlights)),
    setDataParagraph: paragraph => dispatch(setParagraph(paragraph))
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

    // TODO: ...
    handleSubmit() {
        const { chartId, dataAnswer, dataSentence, dataQuestion, lineHighlights, setDataParagraph } = this.props
        const { switches, textfields } = dataAnswer
        const keyHighlights = lineHighlights.map(h => h.key)
        const isGroupFilter = chartId.includes("line") && keyHighlights.length > 0
        // console.log("submit as group?", isGroupFilter)
        // console.log("a:", dataAnswer.switches.flat()) ...

        let paragraphs = []
        // group level
        textfields
            .filter((data, index) => isGroupFilter ? keyHighlights.includes(index) : true)
            .forEach((data, index) => {
                // sentence level
                const tfs = data
                    .map((d, i) => ({ as: d, gIndex: index, sIndex: i }))
                    .filter((d, i) => switches[index][i])
                    .map(d => {
                        const dummyAnswer = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat odio, facilisis tincidunt risus at, placerat porta magna. Ut vel pulvinar ipsum, vel cursus erat."

                        const s = dataSentence.text[d.gIndex][d.sIndex]
                        const p = "[Paragraph" + d.sIndex + "] " + s + d.as.filter(answers => answers.trim() !== "").map(answers => answers + dummyAnswer)
                        paragraphs.push(p)

                        return {
                            ...d, s, p,
                            qs: dataQuestion.text[d.gIndex][d.sIndex]
                        }
                    })
                console.log("*** [dummy] arguments for nlg ***")
                console.log(tfs)
            })
        console.log("*** [dummy] paragraphs ***")

        const dummyParagraph = "[Dummy paragraph] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nunc lacus, egestas vel pharetra ac, cursus ut sapien. In ac ligula nec odio consectetur facilisis eu posuere justo. In hac habitasse platea dictumst. Integer ac lectus id mi maximus iaculis. Nulla facilisi. Ut eu dictum turpis. Aenean suscipit venenatis odio."
        paragraphs = paragraphs.length === 0 ? [dummyParagraph] : paragraphs
        console.log(paragraphs)
        console.log("*** end of [dummy] content ***")

        setDataParagraph(paragraphs)
    }

    componentDidUpdate() {
        const { chartId, dataSentence, setDataSumstat } = this.props
        if (!dataSentence && chartId) {
            setDataSumstat(this.sentences, this.questions, this.answers, this.highlights)
        }
    }

    render() {
        const { chartId, selection, axisMapper, drawingOrder, lineHighlights, dataSentence, dataQuestion, dataAnswer, dataSetup } = this.props
        const { setSelectedChartId, setPlotAxisMapper, setStackDrawingOrder, setLineHighlights, setDataSentenceQuestion, setDataAnswer } = this.props

        // require at leaset chartId to generate questions
        if (!chartId) { return null; }
        // console.log("render step 2: qa -", chartId)

        /* data */
        const { dataChart } = this.props
        const { keys, numberOnly, numberCols, dateFormat, col1Type, col1Header, col1ValuesToStrings } = dataChart

        const numberColGroups = dataChart.keys
        const numberColGroupsCount = numberColGroups.length
        const numberColHeader = numberColGroupsCount > 3 ? (numberColGroups.slice(0, 3).join(", ") + ", ...") : numberColGroups.join(", ")

        // selects
        const optSelection = selection.map(id => ({ key: id, txt: chartInfos[id].task }))
        const optHeaders = numberColGroups.map((header, index) => ({ key: index, txt: header }))

        // use "string" instead of "string1"
        const col1DataType = col1Type.indexOf("str") > -1 ? "string" : col1Type
        // console.log("this:", this.highlights)
        // console.log("line:", lineHighlights)
        /* summary statisitc */
        if (dataSentence) {
            this.sentences = dataSentence
            this.questions = dataQuestion
            this.answers = dataAnswer
            this.highlights = lineHighlights
        } else {
            // remove the first col (or header) of data (types) if all values' type is number
            const colHeaders = numberOnly ? keys.slice(1) : keys
            const sumstatCols = numberOnly ? numberCols.slice(1) : numberCols

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
            const sumstatSentences = sumStats.sentences
            const sumstatQuestions = sumStats.questions
            this.sentences = {
                text: sumstatSentences,     // display text
                edit: [...sumstatSentences] // edit copy to know where to replace the unit* string
            }
            this.questions = {
                text: sumstatQuestions,
                edit: [...sumstatQuestions]
            }

            // init answers
            this.answers = {
                switches: sumstatSentences.map(group =>
                    group.map(() => false)
                ),
                textfields: sumstatQuestions.map(group =>
                    group.map(qs =>
                        qs.map(() => "")
                    ))
            }

            this.highlights = numberColGroupsCount > 10 ?
                [optHeaders[0]] : optHeaders
        }

        /* draw */
        // if (!this.sentences) { return null; }
        const isPlot = chartId.includes("plot")
        const isLine = chartId.includes("line")

        // autocomplete
        // const isHighlight = lineHighlights.length > 0
        const keyHighlights = this.highlights.map(h => h.key)
        const groupFilter = this.sentences.text.map((s, i) => isLine ? keyHighlights.includes(i) : true)
        // const groupFilter = this.sentences.text.map((s, i) => (isLine && isHighlight) ? keyHighlights.includes(i) : true)

        return (
            <div className="questions">
                <ThemeProvider theme={theme}>
                    {/* Set1 Questions */}
                    <p className="question-set">{"Question set: chart " + chartId}</p>

                    {/* Q1: task of the chart and more info */}
                    {selection.length > 1 ? <div className="flex-baseline" style={{ marginBottom: -16 }}>
                        <div className="ws-n">I want to&nbsp;<b>show</b>&nbsp;</div>
                        <div className="flex-column">
                            <SelectSimple
                                qaId="S1Q1" options={optSelection} value={chartId} styles={{ width: "600px" }}
                                setChange={setSelectedChartId}
                            />
                            <ExpansionPanel info={chartInfos[chartId].description} />
                        </div>
                    </div> : null}

                    {/* Q2: axis and size for plots */}
                    {/* TODO: loop optHeaders instead ? */}
                    {isPlot ? <div className="flex-baseline">
                        <div>So use the&nbsp;<b>x-axis</b>&nbsp;for&nbsp;</div>
                        <SelectSimple
                            qaId="S1Q2" options={optHeaders} value={axisMapper[0]}
                            setChange={setPlotAxisMapper} data={axisMapper}
                        />
                        <div>,&nbsp;<b>y-axis</b>&nbsp;for&nbsp;</div>
                        <SelectSimple
                            qaId="S1Q2" options={optHeaders} value={axisMapper[1]}
                            setChange={setPlotAxisMapper} data={axisMapper}
                        />
                        {numberColGroupsCount > 2 ? <div>, and&nbsp;<b>size</b>&nbsp;for&nbsp;</div> : null}
                        {numberColGroupsCount > 2 ? <SelectSimple
                            qaId="S1Q2" options={optHeaders} value={axisMapper[2]}
                            setChange={setPlotAxisMapper} data={axisMapper}
                        /> : null}
                    </div> : null}

                    {/* Q3: unit(s) of number(s), x3 if plots */}
                    <div className="flex-baseline">
                        <div>The numbers on the table refer to&nbsp;</div>
                        {isPlot ?
                            <TextFields
                                helpText={numberColGroups[0]}
                                setChange={setDataSentenceQuestion}
                                data={{ sentences: this.sentences, questions: this.questions, index: 0 }}
                            /> :
                            <TextFields
                                helpText={numberColHeader} styles={{ width: "300px" }}
                                setChange={setDataSentenceQuestion}
                                data={{ sentences: this.sentences, questions: this.questions, isOnlyTF: true }}
                            />
                        }
                        {isPlot ? <div>,{' '}</div> : null}
                        {isPlot ?
                            <TextFields
                                helpText={numberColGroups[1]}
                                setChange={setDataSentenceQuestion}
                                data={{ sentences: this.sentences, questions: this.questions, index: 1 }}
                            /> : null
                        }
                        {isPlot && numberColGroupsCount === 3 ? <div>,{' and '}</div> : null}
                        {isPlot && numberColGroupsCount === 3 ?
                            <TextFields
                                helpText={numberColGroups[2]}
                                setChange={setDataSentenceQuestion}
                                data={{ sentences: this.sentences, questions: this.questions, index: 2 }}
                            /> : null
                        }
                    </div>
                    <div>-- is it $/€/£, people, or years?</div>

                    {/* Q4: header of number cols */}
                    {col1DataType !== "date" ? <div className="flex-baseline">
                        <div>{numberColHeader[0].toUpperCase() + numberColHeader.slice(1) + ' are'}&nbsp;</div>
                        <TextFields defaultValue={col1Header} />
                    </div > : null}

                    {/* Q5: stack drawing order */}
                    {chartId.includes("Stack") ? <div className="flex-baseline">
                        <div>And&nbsp;<b>stack</b>&nbsp;the chart&nbsp;</div>
                        <SelectSimple qaId="S1Q5" options={optDrawing} value={drawingOrder} setChange={setStackDrawingOrder} />
                        <div>{' '}</div>
                        {drawingOrder === 2 ? <Autocomplete options={optHeaders} isSingle={true} /> : null}
                    </div> : null}

                    {/* Q6: line highlights, max 10 lines (colors) */}
                    {/* case 1: 0-5, show all */}
                    {/* case 2: 5-10, highlights all */}
                    {/* case 3: 10-, only highlight the first one */}
                    {isLine && numberColGroupsCount > 5 ? <div className="flex-baseline">
                        <div>And&nbsp;<b>highlight</b>&nbsp;(max. 10 lines)</div>
                        <Autocomplete 
                            options={optHeaders} value={this.highlights} 
                            setChange={setLineHighlights} 
                            data={{ colors: dataSetup.colors }}
                        />
                    </div> : null}

                    {/* Set2 Questions: <switch> sentences and questions <textfield>*/}
                    <p className="question-set mb-5">Question set: statistical summary</p>
                    {/* grouped sentences for toggle */}
                    {this.sentences.text.map((sentences, index) =>
                        <div key={"sq-" + index} className={"mb-5" + (groupFilter[index] ? "" : " d-n")} id={numberColGroups[index].replace(/ /g, '')}>
                            <p><span className="question-group">{numberColGroups[index]}</span></p>
                            {sentences.map((s, idx) => <div key={"s-" + index + idx}>
                                <SwitchLabel
                                    label={s} checked={this.answers.switches[index][idx]}
                                    setChange={setDataAnswer} data={{ answers: this.answers, index: [index, idx] }}
                                />
                                {this.answers.switches[index][idx] ?
                                    this.questions.text[index][idx].map((q, i) => <div key={"q-" + index + idx + i} style={{ width: 600, paddingLeft: 46, color: "rgba(0, 0, 0, 0.54)" }}>
                                        {q}
                                        <TextFields qaId="set2" setChange={setDataAnswer} data={{ answers: this.answers, index: [index, idx, i] }} />
                                    </div>)
                                    : null
                                }
                            </div>)}
                        </div>
                    )}

                    {/* submit button */}
                    {dataAnswer ? <input
                        type="button"
                        className={"button btn-create mb-5 mt-15"}
                        value="Submit"
                        onClick={() => this.handleSubmit()}
                    /> : null}

                </ThemeProvider>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)
