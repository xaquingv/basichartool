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
  index,
})
export const analyzeData = (dataTable, show) => {
  const summary = summarizeData(dataTable, show)
  return {
    type: "ANALYZE_DATA",
    dataBrief: summary,
    selection: selectCharts(summary)
  }
}

/* section 3 */
export const selectChart = (chartId) => ({
  type: "SELECT_CHART",
  chartId
})
export const setupLegend = (keys) => ({
  type: "SET_LEGEND",
  legendKeys: keys
})
export const setKeyColors = (colors) => ({
  type: "SET_COLORS",
  colors: colors
})

/* section 4 */
// changeChartSize
export const pickColor = (color) => ({
  type: "PICK_COLOR",
  pickColor: color
})
export const dropColorTo = (i) => ({
  type: "DROP_COLOR",
  dropIndex: i
})
// changeFillColor
// display
