import parseInputData from '../parsers/parseInputData';

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
    console.log("step:", stepActive);
    return {
        type: "ACTIVE_STEP",
        stepActive
    }
}

/* section 1: import data */
export const importData = (dataInput) => {
    return {
        type: "IMPORT_DATA",
        dataTable: dataInput === "" ? {} : parseInputData(dataInput)
    }
}
export const inputData = (dataInput) => {
    return {
        type: "INPUT_DATA",
        dataInput
    }
}

/* section ... */
