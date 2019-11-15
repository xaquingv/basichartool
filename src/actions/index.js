import parseDataInput from '../data/parseDataInput';
import parseDataTableRaw from '../data/parseDataTableRaw';
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
export const importData = (dataInput) => {
  let dataTable = dataInput === "" ? {} : parseDataInput(dataInput)
  let show = {
    row: dataTable.rows.map(() => true),
    col: dataTable.cols.map(() => true)
  }
  let dataSummary = summarizeData(dataTable, show)
  return {
    type: "IMPORT_DATA",
    dataTable,
    show,
    dataSummary, 
    selection: selectCharts(dataSummary)
  }
}

/* section 2 */
// table
export const transposeData = (dataTable, show) => {
  // swap rows and cols
  const { meta, rows, cols } = dataTable
  let newDataTableRaw = {
    meta,
    rows: cols,
    cols: rows
  }
  /* dataTable = dataTableRaw + dataTableDraw */
  let newDataTable = parseDataTableRaw(newDataTableRaw)
  /* show
   * due to header shift
   * row has an extra toggle that is not used at the end of the list
   * TODO: fix untitles cutting the headers */
  let newShow = {
    row: show.col.slice(1).concat([true]),
    col: [true].concat(show.row.slice(0, -1))
  }
  let dataSummary = summarizeData(newDataTable, newShow)
  return {
    type: "TRANSPOSE_DATA",
    dataTable: newDataTable,
    show: newShow,
    dataSummary, 
    selection: selectCharts(dataSummary)
  }
}

export const toggleData = (dataTable, show, { type, index }) => {
  // toggle on/off a row or col (type)
  const newVal = show[type][index] ? false : true
  /* show */
  let newShow = { ...show }
  newShow[type] = [
    ...show[type].slice(0, index),
    newVal,
    ...show[type].slice(index + 1),
  ]
  let dataSummary = summarizeData(dataTable, newShow)
  return {
    type: "TOGGLE_DATA",
    show: newShow,
    dataSummary, 
    selection: selectCharts(dataSummary)
  }
}

// chart list
export const removeChartDuplicate = (selection, removeId) => {
  let index = selection.indexOf(removeId)
  let newSelection = index !== -1 ? selection.slice(0, index).concat(selection.slice(index+1)) : selection
  return {
    type: "REMOVE_CHART_DUPLICATE",
    selection: newSelection
  }
}

// questions: sumstats
export const setChartId = (chartId) => ({
  type: "SET_CHART_ID",
  chartId
})
export const setAxisMapper = (axisMapper) => ({
  type: "SET_AXIS_MAPPER",
  axisMapper
})
export const setDrawingOrder = (drawingOrder) => ({
  type: "SET_DRAWING_ORDER",
  drawingOrder
})

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
export const updateScaleRange = (type, range) => ({
  type: "UPDATE_RANGE",
  target: type,
  range
})
