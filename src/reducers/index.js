import { combineReducers } from 'redux';
import getNewDataTable from '../data/parseDataTableRaw';

function step(step = 1, action) {
  switch(action.type) {
    // navigation
    case 'CHANGE_STEP':
      return action.step

    // sections
    case 'CLEAR_DATA':
      return 1
    case 'IMPORT_DATA':
    case 'TOGGLE_DATA':
    case 'TRANSPOSE_DATA':
      return 2
    case 'ANALYZE_DATA':
      return 3
    case 'SELECT_CHART':
      return 4

    default:
      return step
  }
}

function stepActive(stepActive = 1, action) {
  switch(action.type) {
    // sections
    case 'CLEAR_DATA':
      return 1
    case 'IMPORT_DATA':
      return 2
    case 'ANALYZE_DATA':
      return 3
    case 'SELECT_CHART':
      return 5

    default:
      return stepActive
  }
}

function dataTable(dataTable = {}, action) {
  switch(action.type) {
    case 'CLEAR_DATA':
      return ""
    case 'IMPORT_DATA':
      // TODO: move meta to dataChart?
      return action.dataTable

    case 'TRANSPOSE_DATA':
      // swap rows and cols
      const {meta, rows, cols} = dataTable
      const newDataTableRaw = {
        meta,
        rows: cols,
        cols: rows
      }
      return getNewDataTable(newDataTableRaw)

    default:
      return dataTable
  }
}

function show(show = {col: [], row: []}, action) {
  switch(action.type) {
    case 'IMPORT_DATA':
      return {
        row: action.dataTable.rows.map(() => true),
        col: action.dataTable.cols.map(() => true)
      }
    case 'TRANSPOSE_DATA':
      // due to header shift
      // row has an extra toggle that is not used at the end of the list
      // TODO: fix untitles cutting the headers
      return {
        row: show.col.slice(1).concat([true]),
        col: [true].concat(show.row.slice(0, -1))
      }

    case 'TOGGLE_DATA':
      const {target, index} = action
      const newVal = show[target][index] ? false : true

      let newShow = { ...show }
      newShow[target] = [
        ...show[target].slice(0, index),
        newVal,
        ...show[target].slice(index + 1),
      ]
      return newShow

    default:
      return show
  }
}

function dataChart(dataChart = {/*legend: [], scales:{}, indent: 0, marginTop: 0*/}, action) {
  switch(action.type) {
    // reset
    case 'ANALYZE_DATA':
      //console.log("reset chart data")
      //console.log(dataChart)
      //console.log(action.dataChart)
      const resetDataChart = {legend: [], scales:{}, margin: undefined, indent: 0, marginTop: 0}
      return {
        //...dataChart,
        ...resetDataChart,
        ...action.dataChart,
        //margin: {},
      }

    /* TODO: rename and clean up */
    case 'APPEND_DATA':
      //if(action.scales.x) console.log(action.scales.x.domain())
      //if(action.scales.y) console.log(action.scales.y.domain())
      return {
        ...dataChart,
        legend: action.legend,
        scales: action.scales,
        margin: action.margin,
        ranges: {
          x: action.scales.x ? action.scales.x.domain() : null,
          y: action.scales.y ? action.scales.y.domain() : null
        }
      }

    // res y
    case 'APPEND_YSCALE':
      return {
        ...dataChart,
        indent: action.widthIndent,
        height: action.height,// || dataChart.height,
        marginTop: action.marginTop,// || dataChart.marginTop
      }
    /* end of clean up */

    // res editor
    case 'UPDATE_YLABEL_RES':
      return {
        ...dataChart,
        string1IsRes: action.isRes,
        string1Width: action.widthLabel
      }
    case 'UPDATE_YLABEL_CHANGE':
      let newLabelGroup = dataChart.rowGroup
      newLabelGroup[action.index] = action.label
      return {
        ...dataChart,
        rowGroup: newLabelGroup
      }

    case 'UPDATE_RANGE':
      //console.log(dataChart.scales[action.target].domain())
      let newScales = {...dataChart.scales}
      newScales[action.target].domain(action.range)
      //console.log(newScales[action.target].domain())
      return {
        ...dataChart,
        scales: newScales
      }

    default:
      return dataChart
  }
}

function selection(chartList = [], action) {
  switch(action.type) {
    case 'ANALYZE_DATA':
      return action.selection
    default:
      return chartList
  }
}

function chartId(id = "", action) {
  switch(action.type) {
    case 'SELECT_CHART':
      return action.chartId
    default:
      return id
  }
}

function dataSetup(dataSetup = {colors:[], display:{}, legend:[], size:{}, width: "300px"}, action) {
  switch(action.type) {
    case 'SET_DISPLAY':
      return {
        ...dataSetup,
        display: action.displaySwitches
      }
    case 'UPDATE_DISPLAY':
      let newSwitches = {...dataSetup.display}
      newSwitches[action.metaKey] = !newSwitches[action.metaKey]
      return {
        ...dataSetup,
        display: newSwitches
      }
    case 'UPDATE_SIZE':
      return {
        ...dataSetup,
        size: action.size
      }
    case 'UPDATE_WIDTH':
      return {
        ...dataSetup,
        width: action.width
      }
    case 'SET_COLORS':
      return {
        ...dataSetup,
        colors: action.colors
      }
    case 'PICK_COLOR':
      return {
        ...dataSetup,
        pickColor: action.pickColor
      }
    case 'DROP_COLOR':
      let newColors = dataSetup.colors.slice()
      newColors[action.dropIndex] = dataSetup.pickColor
      return {
        ...dataSetup,
        colors: newColors
      }

    default:
      return dataSetup
  }
}

function dataEditable(dataEditable = {}, action) {
  switch(action.type) {
    // reset
    case 'SELECT_CHART':
      return {}
    // update
    case 'UPDATE_COLOR_INPUT':
      return {
        ...dataEditable,
        colorInput: action.colorInput
      }
    case 'APPEND_AXIS':
      //console.log("=>", dataEditable.axis ? dataEditable[action.target] : dataEditable.axis)
      // mutate !?
      let appendAxis = dataEditable.axis || {x: {}, y: {}}
      appendAxis[action.target] = action.dataAxis || {ticks:[], range:[]}
      //console.log("=>", action.target, appendAxis[action.target])
      return {
        ...dataEditable,
        axis: appendAxis
      }
    case 'UPDATE_AXIS':
      let updateAxis = {...dataEditable.axis}
      //console.log("update", updateAxis[action.target1][action.target2])
      updateAxis[action.target1][action.target2] = action.dataTarget
      //console.log("update", action.dataTarget)
      return {
        ...dataEditable,
        axis: updateAxis
      }
    default:
      return dataEditable
  }
}

const app = combineReducers({
  step,
  stepActive,
  show,
  dataTable,
  dataChart,
  selection,
  chartId,
  dataSetup,
  dataEditable
});

export default app
