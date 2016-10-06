import parseInputData from '../lib/parseInputData';

/* navigation */
export const changeStep = (step) => {
    return {
        type: "CHANGE_STEP",
        step
    }
}
export const nextStep = (step) => {
    return {
        type: "NEXT_STEP",
        step
    }
}
export const activeStep = (stepActive) => {
    console.log(stepActive);
    return {
        type: "ACTIVE_STEP",
        stepActive
    }
}

/* section 1: import data */
export const importData = (dataInput) => {
    return {
        type: "IMPORT_DATA",
        data: parseInputData(dataInput)
    }
}
export const inputData = (dataInput) => {
    return {
        type: "INPUT_DATA",
        dataInput
    }
}

/* section ... */
