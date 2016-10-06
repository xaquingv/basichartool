import { combineReducers } from 'redux';

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
            return action.step;
        // sections
        case 'NEXT_STEP':
            return action.step + 1;
        default:
            return step;
    }
}
function stepActive(stepActive = 1, action) {
    switch(action.type) {
        case 'ACTIVE_STEP':
            return action.stepActive;
        default:
            return stepActive;
    }
}

function data(data = {}, action) {
    switch(action.type) {
        case 'IMPORT_DATA':
            return action.data;
        default:
            return data;
    }
}
function dataInput(dataInput = "", action) {
    switch(action.type) {
        case 'INPUT_DATA':
            return action.dataInput;
        default:
            return dataInput;
    }
}

const app = combineReducers({
  step,
  stepActive,
  data,
  dataInput
})

export default app
