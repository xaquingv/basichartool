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
    case 'SET_CHART_ID':
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
    case 'SET_CHART_ID':
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
    case 'CLEAR_DATA':
      return "";
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
    case 'REMOVE_CHART_DUPLICATE':
      return action.selection.length !== 0 ? action.selection[0] : ""
    case 'SET_CHART_ID':
      return action.chartId
    default:
      return id
  }
}

function selection(chartList = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
      return null
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
  const initDataChart = { legend: [], scales: {}, margin: undefined, indent: 0, marginTop: 0 }

  switch (action.type) {
    // init
    // TODO: apply on setParagragh (step3), 
    // otherwise (step2), only action.dataSummary.chart is needed 
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return {
        ...initDataChart,
        ...action.dataSummary.chart,
        isInit: true,
      }
    case 'SET_CHART_ID':
      return {
        ...dataChart,
        ...initDataChart,
        isInit: true
      }

    case 'SET_AXIS_MAPPER':
      let newDataChart = { ...dataChart }
      newDataChart.numberCols = action.axisMapper.map(index => dataChart.numberCols[index])
      // console.log(dataChart.numberCols)
      // console.log(newDataChart.numberCols)
      return dataChart//newDataChart

    case 'SET_PARAGRAPG':
      // console.log("SET_PARAGRAPG =>")
      // console.log("rangeY:", dataChart.scales.y ? dataChart.scales.y.domain() : null)
      // console.log("legend:", dataChart.legend)
      return {
        ...dataChart,
        isInit: false
      }

    /* TODO: rename and clean up */
    case 'APPEND_DATA':
      const { legend, scales, margin } = action
      // console.log('APPEND_DATA=>')
      // console.log("rangeY:", scales.y ? scales.y.domain() : null)
      // console.log("legend:", legend)
      return {
        ...dataChart,
        legend,
        scales,
        margin,
        ranges: {
          x: scales.x ? scales.x.domain() : null,
          y: scales.y ? scales.y.domain() : null
        },
        isInit: false
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

// sumstats' answers in set1
function axisMapper(axisMapper = [0, 1, 2], action) {
  return action.type === 'SET_AXIS_MAPPER' ? action.axisMapper : axisMapper
}
function drawingOrder(drawingOrder = {select: 0, priority: {index: null, value:""}}, action) {
  return action.type === "SET_DRAWING_ORDER" ? action.drawingOrder : drawingOrder
}
function lineHighlights(highlights = [], action) {
  switch (action.type) {
    case 'CLEAR_DATA':
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return null
    case 'SET_SUMSTAT':
    case 'SET_HIGHLIGHTS':
    case 'DROP_COLORLINE':
      return action.highlights
    default:
      return highlights

  }
}
// sumstats' answers in set2
function dataAnswer(dataAnswer = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return null
    case 'SET_ANSWERS':
    case 'SET_SUMSTAT':
      return action.dataAnswer
    default:
      return dataAnswer
  }
}
// sumstats' sentence sets with swtiches
function dataSentence(dataSentence = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return null
    case 'SET_SUMSTAT':
    case 'SET_QUESTION_SENTENCES':
      return action.dataSentence
    default:
      return dataSentence
  }
}
// sumstats' follow up questions with textfields
function dataQuestion(dataQuestion = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return null
    case 'SET_SUMSTAT':
    case 'SET_QUESTION_SENTENCES':
      return action.dataQuestion
    default:
      return dataQuestion
  }
}
// sumstats' paragraph data
function dataParagraph(dataParagraph = null, action) {
  switch (action.type) {
    case 'CLEAR_DATA':
    case 'IMPORT_DATA':
    case 'TRANSPOSE_DATA':
    case 'TOGGLE_DATA':
      return null
    case 'SET_PARAGRAPH':
      return action.dataParagraph
    default:
      return dataParagraph
  }
}

function dataSetup(dataSetup = { colors: [], colorLines: [], display: {}, legend: [], size: {}, width: "300px" }, action) {
  switch (action.type) {
    // reset
    case 'SELECT_CHART':
    case 'SET_PARAGRAPH':
      return {
        ...dataSetup,
        pickColor: ""//dataSetup.colors[0]//"#000000"
      }
    case 'INIT_SETUP':
      return {
        ...dataSetup,
        colors: action.colors,
        colorLines: action.colors,
        display: action.displaySwitches
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
    case 'SET_HIGHLIGHTS':
      return {
        ...dataSetup,
        colorLines: action.colors
      }
    // case 'SET_COLORS':
    //   return {
    //     ...dataSetup,
    //     colors: action.colors
    //   }
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
        colors: newColors,
      }
    case 'DROP_COLORLINE': {
      let newColors = dataSetup.colorLines.slice()
      newColors[action.dropIndex] = dataSetup.pickColor ? dataSetup.pickColor : dataSetup.colorLines[action.dropIndex]
      return {
        ...dataSetup,
        colorLines: newColors
      }
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
  // step2
  show,
  selection,
  chartId,
  dataChart,
  dataTable,
  dataCount,
  axisMapper,
  drawingOrder,
  lineHighlights,
  // step2: sumstat
  dataAnswer,
  dataSentence,
  dataQuestion,
  dataParagraph,
  // step3
  dataSetup,
  dataEditable
});

export default app
