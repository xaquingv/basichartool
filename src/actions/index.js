/* navigation */
export const changeStep = (step) => {
    return {
        type: "CHANGE_STEP",
        step 
    }
}

/* section 1: impoart data */
export const validateDATA = (data) => {
    return {
        type: "VALIDATE_DATA",
        data
    }
}
export const importData = (data) => {
    return {
        type: "IMPORT_DATA",
        data
    }
}
export const clearData = () => {
    return {
        type: "CLEAR_DATA",
        data: ""
    }
}

/* section ... */
