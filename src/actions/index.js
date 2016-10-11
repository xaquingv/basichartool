import parseInputData from '../parsers/parseInputData';
import summarizeData from '../parsers/summarizeData';

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
  dataTable: dataInput === "" ? {} : parseInputData(dataInput)
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
export const analyzeData = (dataTable, show) => ({
  type: "ANALYZE_DATA",
  dataBrief: summarizeData(dataTable, show)
})
