import parseDataInput from '../data/parseDataInput';
import summarizeData from '../data/summarizeData';
import selectCharts from '../data/selectCharts';

/* navigation */
export const changeStep = (step) => ({
  type: "CHANGE_STEP",
  step
})
export const activeStep = (stepActive) => ({
  type: "ACTIVE_STEP",
  stepActive
})

/* section 1 */
export const clearData = () => ({
  type: "CLEAR_DATA",
})
/*export const inputData = (dataInput) => ({
  type: "INPUT_DATA",
  dataInput
})*/
export const importData = (dataInput) => ({
  type: "IMPORT_DATA",
  dataTable: dataInput === "" ? {} : parseDataInput(dataInput)
})

/* section 2 */
export const transposeData = () => ({
  type: "TRANSPOSE_DATA",
})
export const toggleData = ({type, index}) => ({
  type: "TOGGLE_DATA",
  target: type,
  index
})
// analyze data to get a selection of charts
export const analyzeData = (dataTable, show) => {
  const summary = summarizeData(dataTable, show)
  return {
    type: "ANALYZE_DATA",
    dataBrief: summary,
    dataChart: summary.chart,
    selection: selectCharts(summary)
  }
}
export const setSelectionInOrder = (selectionInOrder) => ({
  type: "SET_SELECTION_ORDER",
  selectionInOrder 
})

// sumstats
export const setAnswers = (dataAnswer, dataSentence) => ({
  type: "SET_ANSWERS",
  dataAnswer,
  dataSentence
})
export const setQuestions = (dataQuestion) => ({
  type: "SET_QUESTIONS",
  dataQuestion
})
export const setParagraph = (dataParagraph, dataChart, chartId) => ({
  type: "SET_PARAGRAPH",
  dataParagraph,
  dataChart,
  chartId
})

/* section 3 */
export const selectChart = (chartId) => ({
  type: "SELECT_CHART",
  chartId,
})
export const setColors = (colors) => ({
  type: "SET_COLORS",
  colors
})
export const appendChartData = (dataChart, legend, scales, margin) => ({
  type: "APPEND_DATA",
  dataChart,
  legend,
  scales,
  margin
})

/* section 4 */
export const setDisplay = (switches) => ({
  type: "SET_DISPLAY",
  displaySwitches: switches
})
export const updateDisplay = (key) => ({
  type: "UPDATE_DISPLAY",
  metaKey: key
})
export const updateSize = (size) => ({
  type: "UPDATE_SIZE",
  size
})
export const updateWidth = (width) => ({
  type: "UPDATE_WIDTH",
  width
})
export const pickColor = (color) => ({
  type: "PICK_COLOR",
  pickColor: color
})
export const dropColorTo = (i) => ({
  type: "DROP_COLOR",
  dropIndex: i
})
// texts on y axis with ticks
export const appendAxisYScaleRes = (widthIndent, height, marginTop) => ({
  type: "APPEND_YSCALE",
  height,
  marginTop,
  widthIndent
})
// label on y axis (no ticks)
export const updateAxisYLabelRes = (dataRes) => ({
  type: "UPDATE_YLABEL_RES",
  isRes: dataRes.string1IsRes,
  widthLabel: dataRes.string1Width
})
export const updateAxisYLabelChange = (dataChange) => ({
  type: "UPDATE_YLABEL_CHANGE",
  ...dataChange
})
export const appendAxisData = (type, dataAxis) => ({
  type: "APPEND_AXIS",
  target: type, // x or y
  dataAxis
})

// edit panel 1
export const updateCustomColor = (colorInput) => ({
  type: "UPDATE_COLOR_INPUT",
  colorInput
})
// edit panel 2
export const updateAxisDataOnTypes = (type1, type2, dataTarget, dataTargetExtra) => ({
  type: "UPDATE_AXIS",
  target1: type1, // x or y
  target2: type2, // ticks or range§
  dataTarget,
  dataTargetExtra
})
export const updateScaleRange = (type, range) =>({
  type: "UPDATE_RANGE",
  target: type,
  range
})
