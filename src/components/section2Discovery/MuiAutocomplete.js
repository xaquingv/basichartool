import React from 'react';
import { connect } from 'react-redux'
import { setDrawingOrder } from '../../actions'
import { colors } from '../../data/config';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

// TODO: update to Hooks instead
// https://react-redux.js.org/next/api/hooks#useselector-examples
const mapStateToProps = state => ({
    dataChart: state.dataChart,
    drawingOrder: state.drawingOrder
})
const mapDispatchToProps = dispatch => ({
    setStackDrawingOrder: order => dispatch(setDrawingOrder(order)),
})

const useStyles = makeStyles(theme => ({
    single: {
        display: "inline-flex",
        width: 300,
        height: 32,
        marginLeft: theme.spacing(1)
    },
    multiple: {
        display: "inline-flex",
        minWidth: 600,
        height: 32,
        marginLeft: theme.spacing(1),
    }
    // TODO: chips' height
}));

function AutocompleteTextField(props) {
    const { options, isSingle, value, setChange, data, drawingOrder } = props;
    const flatProps = {
        options: options.map(option => option.txt)
    };

    const classes = useStyles();

    const handleChangeSingle = (event, newValue) => {
        const { dataChart, setStackDrawingOrder } = props
        const newOrder = {
            select: drawingOrder.select, 
            priority: {
                index: dataChart.keys.indexOf(newValue), 
                value: newValue
        }}
        setStackDrawingOrder(newOrder);
    }
    
    const handleChangeMultiple = (event, newValue) => {
        // remove duplicate itmes
        let filteredValue = newValue.filter((value, index) => index === newValue.findIndex(v => v.key === value.key))
        
        // remove items > 10
        if (filteredValue > 10) filteredValue.splice(10)
        
        // remap colors
        const colorLines = data.colors
        let nextColor = colors.find(r => !colorLines.includes(r)) // next available color
        let newColors = [...colorLines].map(() => "")
        filteredValue.forEach((value, index) => {
            const key = value.key
            // step 2: use default color palette (a)
            // step 3: use mapped color (b), or next available color (c)
            newColors[key] = colorLines[key] ? 
                (data.stepActive === 2 ? colors[index] /*(a)*/ : colorLines[key] /*(b)*/) : 
                nextColor /*(c)*/
        })

        setChange(filteredValue, newColors);
    }

    return isSingle ? (
        <Autocomplete
            {...flatProps}
            value={drawingOrder.priority.value || options[0].txt}
            onChange={handleChangeSingle}
            className={classes.single}
            autoHighlight
            renderInput={params => (
                <TextField
                    {...params}
                    margin="none"
                    fullWidth
                />
            )}
        />
    ) : (
        <Autocomplete
            multiple
            options={options}
            getOptionLabel={option => option.txt}
            value={value}
            onChange={handleChangeMultiple}
            className={classes.multiple}
            autoHighlight
            renderInput={params => (
                <TextField
                    {...params}
                    placeholder={value.length === 0 ? "Please type one or more highlights. Required*" : ""}
                    margin="none"
                    fullWidth
                />
            )}
        />
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteTextField)