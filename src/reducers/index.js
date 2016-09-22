export default (step = 1, action) => {
    switch (action.type) {
        case 'CHANGE_STEP':
            console.log(action);
            step = action.index;     
            return step;
    }
}
