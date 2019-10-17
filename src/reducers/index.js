import { combineReducers } from 'redux';
import getNewDataTable from '../data/parseDataTableRaw';
// import { default_metaText } from '../data/config';

function step(step = 1, action) {
  switch (action.type) {
    // navigation
    case 'CHANGE_STEP':
      return action.step

    // sections
    // case 'INPUT_DATA'
    case 'CLEAR_DATA':
      return 1
    case 'IMPORT_DATA':
    case 'TOGGLE_DATA':
    case 'TRANSPOSE_DATA':
      //case 'ANALYZE_DATA':
      return 2
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return 3

    default:
      return step
  }
}

function stepActive(stepActive = 1, action) {
  switch (action.type) {
    // sections
    case 'CLEAR_DATA':
      return 1
    case 'IMPORT_DATA':
    case 'TOGGLE_DATA':
    case 'TRANSPOSE_DATA':
      return 2
    //case 'ANALYZE_DATA':
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return 3

    default:
      return stepActive
  }
}

function dataTable(dataTable = {}, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return ""
    case 'IMPORT_DATA':
      // TODO: move meta to dataChart?
      return action.dataTable

    case 'TRANSPOSE_DATA':
      // swap rows and cols
      const { meta, rows, cols } = dataTable
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

function show(show = { col: [], row: [] }, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return ""
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
      const { target, index } = action
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

// sumstats' answer sets
function dataAnswer(dataAnswer = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return null
    case 'SET_ANSWERS':
      return action.dataAnswer
    default:
      return dataAnswer
  }
}
// sumstats' question sets for text editing
function dataSentence(dataSentence = null, action) {
  switch (action.type) {
    case 'SET_ANSWERS':
      return action.dataSentence || dataSentence
    default:
      return dataSentence
  }
}
// sumstats' follow up questions
function dataQuestion(dataQuestion = null, action) {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.dataQuestion
    default:
      return dataQuestion
  }
}
// sumstats' paragraph data
function dataParagraph(dataParagraph = null, action) {
  switch (action.type) {
    case 'SET_PARAGRAPH':
      return action.dataParagraph
    default:
      return dataParagraph
  }
}

function chartId(id = "", action) {
  switch (action.type) {
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return action.chartId || id
    default:
      return id
  }
}

function dataChart(dataChart = {}, action) {
  switch (action.type) {
    // reset
    // TODO: debug
    case 'ANALYZE_DATA':
    //case 'SET_PARAGRAPH':
      const resetDataChart = { legend: [], scales: {}, margin: undefined, indent: 0, marginTop: 0 }
      return {
        ...resetDataChart,
        ...action.dataChart,
      }

    /* TODO: rename and clean up */
    case 'APPEND_DATA':
      return {
        ...action.dataChart,
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
      let newScales = { ...dataChart.scales }
      newScales[action.target].domain(action.range)
      return {
        ...dataChart,
        scales: newScales
      }

    default:
      return dataChart
  }
}

function selection(chartList = [], action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return []
    case 'ANALYZE_DATA':
      return action.selection
    default:
      return chartList
  }
}
function selectionInOrder(chartList = [], action) {
  switch(action.type) {
    // case 'TOGGLE_DATA':
    // case 'TRANSPOSE_DATA':
    // case 'SELECT_CHART':
    case 'CLEAR_DATA':
      return []
    case 'SET_SELECTION_ORDER':
      return action.selectionInOrder
    default:
      return chartList
  }
}

function dataSetup(dataSetup = { colors: [], display: {}, legend: [], size: {}, width: "300px" }, action) {
  switch (action.type) {
    // reset
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return {
        ...dataSetup,
        pickColor: ""//dataSetup.colors[0]//"#000000"
      }
    // setup
    case 'SET_DISPLAY':
      return {
        ...dataSetup,
        display: action.displaySwitches
      }
    case 'UPDATE_DISPLAY':
      let newSwitches = { ...dataSetup.display }
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
      newColors[action.dropIndex] = dataSetup.pickColor ? dataSetup.pickColor : dataSetup.colors[action.dropIndex]
      return {
        ...dataSetup,
        colors: newColors
      }

    default:
      return dataSetup
  }
}

function dataEditable(dataEditable = {}, action) {
  switch (action.type) {
    // reset
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return {}
    // update
    case 'UPDATE_COLOR_INPUT':
      return {
        ...dataEditable,
        colorInput: action.colorInput
      }
    case 'APPEND_AXIS':
      // mutate !?
      let appendAxis = dataEditable.axis || { x: {}, y: {} }
      appendAxis[action.target] = action.dataAxis || { ticks: [], range: [] }
      return {
        ...dataEditable,
        axis: appendAxis
      }
    case 'UPDATE_AXIS':
      let updateAxis = { ...dataEditable.axis }
      updateAxis[action.target1][action.target2] = action.dataTarget
      if (action.dataTargetExtra) {
        updateAxis[action.target1].edits[action.target2] = action.dataTargetExtra
      }
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
  dataAnswer,
  dataSentence,
  dataQuestion,
  dataParagraph,
  dataChart,
  selection,
  selectionInOrder,
  chartId,
  dataSetup,
  dataEditable
});

export default app
