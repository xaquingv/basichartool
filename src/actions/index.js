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
export const inputData = (dataInput) => ({
  type: "INPUT_DATA",
  dataInput
})
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
export const analyzeData = (dataTable, show) => {
  const summary = summarizeData(dataTable, show)
  return {
    type: "ANALYZE_DATA",
    dataBrief: summary,
    dataChart: summary.chart,
    selection: selectCharts(summary)
  }
}

/* section 3 */
export const selectChart = (chartId) => ({
  type: "SELECT_CHART",
  chartId
})
export const setColors = (colors) => ({
  type: "SET_COLORS",
  colors
})
export const updateChartData = (legend, scales, margin) => ({
  type: "UPDATE_DATA",
  legend,
  scales,
  margin
})

/* section 4 */
// changeChartSize
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
export const appendAxisYScale = (indent, height, marginTop) => ({
  type: "APPEND_YSCALE",
  widthIndent: indent,
  height,
  marginTop
})
// edit panel 1
export const updateCustomColor = (colorInput) => {
  return {
    type: "UPDATE_COLOR_INPUT",
    colorInput
}}
// edit panel 2
/*export const updateXTicks = (xTicks) => ({
  type: "UPDATE_X_TICKS",
  xTicks
})
export const updateYTicks = (yTicks) => ({
  type: "UPDATE_Y_TICKS",
  yTicks
})
export const updateXRange = (xRange) => ({
  type: "UPDATE_X_RANGE",
  xRange
})
export const updateYRange = (yRange) => ({
  type: "UPDATE_Y_RANGE",
  yRange
})
// chart
export const updateXLabels = (xLabels) => ({
  type: "UPDATE_X_LABELS",
  xLabels
})
export const updateYLabels = (yLabels) => ({
  type: "UPDATE_Y_LABELS",
  yLabels
})
export const updateLegends = (legends) => ({
  type: "UPDATE_LEGENDS",
  legends
})
export const updateMetaText = (meta, text) => ({
  type: "UPDATE_META_TEXT",
  meta,
  text
})*/
