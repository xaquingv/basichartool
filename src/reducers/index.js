import { combineReducers } from 'redux';
// import { default_metaText } from '../data/config';

function step(step = 1, action) {
  switch (action.type) {
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
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return 3

    default:
      return stepActive
  }
}

// TODO: move meta to dataChart?
function dataTable(dataTable = {}, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return ""
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
      return action.dataTable
    default:
      return dataTable
  }
}

function show(show = { col: [], row: [] }, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return ""

    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return action.show

    default:
      return show
  }
}

function chartId(id = "", action) {
  switch (action.type) {
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
    case 'REMOVE_CHART_DUPLICATE':
      return action.selection[0]
    case 'SET_CHART_ID':
      return action.chartId
    // case 'SELECT_CHART':
    // case 'SET_PARAGRAPH':
    // return action.chartId || id
    default:
      return id
  }
}

function selection(chartList = [], action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return []
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
    case 'REMOVE_CHART_DUPLICATE':
      return action.selection
    default:
      return chartList
  }
}

function dataCount(dataCount = {}, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return {}
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return action.dataSummary.count
    default:
      return dataCount
  }  
}

function dataChart(dataChart = {}, action) {
  switch (action.type) {
    // init
    // TODO: debug ?
    case 'IMPORT_DATA':
      const initDataChart = { legend: [], scales: {}, margin: undefined, indent: 0, marginTop: 0 }
      return {
        ...initDataChart,
        ...action.dataSummary.chart,
      }

    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return {
        ...dataChart,
        ...action.dataSummary.chart
      }
    case 'SET_AXIS_MAPPER':
      let newDataChart = {...dataChart}
      newDataChart.numberCols = action.axisMapper.map(index => dataChart.numberCols[index]) 
      console.log(dataChart.numberCols)
      console.log(newDataChart.numberCols)
      return dataChart//newDataChart

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

// sumstats' answer sets
function axisMapper(axisMapper = [0, 1, 2], action) {
  return action.type === 'SET_AXIS_MAPPER' ? action.axisMapper : axisMapper
}
function drawingOrder(drawingOrder = 0, action) {
  return action.type === "SET_DRAWING_ORDER" ? action.drawingOrder : drawingOrder
}

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
  selection,
  dataChart,
  dataTable,
  dataCount,
  axisMapper,
  drawingOrder,
  dataAnswer,
  dataSentence,
  dataQuestion,
  dataParagraph,
  chartId,
  dataSetup,
  dataEditable
});

export default app
