import { combineReducers } from 'redux';
import getNewDataTable from '../data/getDataTable';

// function dummyReducer(prevState = {}, action) {
//     switch (action.type) {
//     case 'GO_TO_BED':
//       // return {
//       //   ...prevState,
//       //   sleeping: true,
//       // };
//       return Object.assign(
//         {},
//         prevState,
//         stomach: prevState.stomach,
//         {sleeping: true}
//       );
//     case 'EAT_SOMETHING':
//       if (prevState.sleeping) {
//         // cannot eat and sleep
//       }
//       return {
//         ...prevState,
//         stomach: [...prevState.stomach, action.food],
//       };
//     default:
//       return prevState;
//     }
// }

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

function dataInput(dataInput = "", action) {
  switch(action.type) {
    case 'CLEAR_DATA':
      return ''
    case 'INPUT_DATA':
      return action.dataInput
    default:
      return dataInput
  }
}

function dataTable(dataTable = {}, action) {
  switch(action.type) {
    case 'CLEAR_DATA':
      return ''
    case 'IMPORT_DATA':
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

      //console.log('Toggling ', target, index);
      //console.log('new val ', newVal);
      //console.log(show[target][index]);
      //console.log(newShow[target][index]);
      //console.dir(newShow);
      return newShow

    default:
      return show
  }
}

function dataBrief(dataBrief = {}, action) {
  switch(action.type) {
    case 'ANALYZE_DATA':
      return action.dataBrief
    default:
      return dataBrief
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

function dataSetup(dataSetup = {colors:[], display:{}, legend:[]}, action) {
  switch(action.type) {
    case 'EDIT_CHART':
      return action.dataSetup
    case 'SET_LEGEND':
      return {
        ...dataSetup,
        legend: action.legendKeys
      }

    // TODO: ...
    case 'SET_DISPLAY':
      return {
        ...dataSetup,
        display: action.displaySwitches
      }
    case 'UPDATE_DISPLAY':
      const newSwitches = {...dataSetup.display}
      newSwitches[action.metaKey] = !newSwitches[action.metaKey]
      return {
        ...dataSetup,
        display: newSwitches
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
      const newColors = dataSetup.colors.slice()
      newColors[action.dropIndex] = dataSetup.pickColor
      return {
        ...dataSetup,
        colors: newColors
      }

    default:
      return dataSetup
  }
}

const app = combineReducers({
  step,
  stepActive,
  dataInput,
  dataTable,
  show,
  dataBrief,
  selection,
  chartId,
  dataSetup
});

export default app
