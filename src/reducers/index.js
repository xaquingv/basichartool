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

/*function dataInput(dataInput = "", action) {
  switch(action.type) {
    case 'CLEAR_DATA':
      return ""
    case 'INPUT_DATA':
      return action.dataInput
    default:
      return dataInput
  }
}*/

function dataTable(dataTable = {}, action) {
  switch(action.type) {
    case 'CLEAR_DATA':
      return ""
    case 'IMPORT_DATA':
      // TODO: move meta to dataChart?
      //console.log(action.dataTable)
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

/*function dataBrief(dataBrief = {}, action) {
  switch(action.type) {
    case 'ANALYZE_DATA':
      return action.dataBrief
    default:
      return dataBrief
  }
}*/
function dataChart(dataChart = {legend: [], scales:{}, indent: 0, marginTop: 0}, action) {
  //console.log("action", action.type)
  switch(action.type) {
    case 'ANALYZE_DATA':
      return {
        ...dataChart,
        ...action.dataChart
      }

    /* TODO: clean up */
    case 'UPDATE_DATA':
      return {
        ...dataChart,
        legend: action.legend,
        scales: action.scales,
        margin: action.margin //|| {left: 0, right: 0},
        //indent: action.margin.left
      }
    case 'APPEND_YSCALE':
      return {
        ...dataChart,
        indent: action.widthIndent,
        height: action.height,
        marginTop: action.marginTop
      }
    /* end of clean up */

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
      const newSwitches = {...dataSetup.display}
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

function dataEditable(dataEditable = {metaText:{}}, action) {
  switch(action.type) {
    case 'UPDATE_COLOR_INPUT':
      return {
        ...dataEditable,
        colorInput: action.colorInput
      }
    /*case 'UPDATE_META_TEXT':
      console.log(action)
      let newMetaText = dataEditable.metaText
      newMetaText[action.type] = action.text
      return {
        ...dataEditable,
        metaText: newMetaText
      }
    case 'UPDATE_X_TICKS':
      return {
        ...dataEditable,
        xTicks: action.xTicks
      }
    case 'UPDATE_Y_TICKS':
      return {
        ...dataEditable,
        yTicks: action.yTicks
      }
    case 'UPDATE_X_RANGE':
      return {
        ...dataEditable,
        xRange: action.xRange
      }
    case 'UPDATE_Y_RANGE':
      return {
        ...dataEditable,
        yRange: action.yRange
      }
    case 'UPDATE_X_LABELS':
      return {
        ...dataEditable,
        xLabels: action.xLabels
      }
    case 'UPDATE_Y_LABELS':
      return {
        ...dataEditable,
        yLabels: action.yLabels
      }
    case 'UPDATE_LEGENDS':
      return {
        ...dataEditable,
        legends: action.legends
      }*/
    default:
      return dataEditable
  }
}

const app = combineReducers({
  step,
  stepActive,
  //dataInput,
  dataTable,
  show,
  //dataBrief,
  dataChart,
  selection,
  chartId,
  dataSetup,
  dataEditable
});

export default app
