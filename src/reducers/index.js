import { combineReducers } from 'redux';
import getNewDataTable from '../parsers/getDataTable';

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
      // swape rows and cols
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
      return {
        row: show.col,
        col: show.row
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

const app = combineReducers({
  step,
  stepActive,
  dataInput,
  dataTable,
  show,
  dataBrief
});

export default app
