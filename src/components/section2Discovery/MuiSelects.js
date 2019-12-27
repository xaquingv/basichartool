import React from 'react';
import { connect } from 'react-redux'
import { setDrawingOrder } from '../../actions'
import { indexOfGreatestValueInArray } from '../../lib/array'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// ref: codesandbox.io/s/material-demo-35ywt

// TODO: update to Hooks instead
// https://react-redux.js.org/next/api/hooks#useselector-examples
const mapStateToProps = state => ({
    dataChart: state.dataChart,
    drawingOrder: state.drawingOrder,
})
const mapDispatchToProps = dispatch => ({
    setStackDrawingOrder: order => dispatch(setDrawingOrder(order)),
})

const useStyles = makeStyles(theme => ({
    formControl: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: 0//theme.spacing(2),
    },
}));

/*export default*/ function SimpleSelect(props) {
    const { options, value, setChange, qaId, data, styles } = props
    const classes = useStyles();

    const handleChange = event => {
        const newValue = event.target.value
        switch (qaId) {
            // task for the chart
            case "S1Q1":
                setChange(newValue)
                break
            
            // axis (and size) mapper in plot 
            case "S1Q2":
                const newMapper = [...data]
                newMapper[data.indexOf(value)] = newValue
                newMapper[data.indexOf(newValue)] = value
                setChange(newMapper)
                break

            // stack order
            case "S1Q5":
                const { dataChart, drawingOrder, setStackDrawingOrder } = props
                const { numberColSums, keys } = dataChart
                
                let priority; 
                switch (newValue) {
                    case 0:
                        priority = {index: null, value:""}
                        break
                    case 1:
                        // index of greatest value in an array
                        const indexMax = indexOfGreatestValueInArray(numberColSums)
                        priority = {
                            index: indexMax, 
                            value: keys[indexMax] 
                        }
                        break
                    case 2:
                        priority = drawingOrder.priority
                        break;
                    default:
                        console.log("add a new case here!")
                }
                
                const newOrder = {
                    select: newValue, 
                    priority
                }
                setStackDrawingOrder(newOrder)
                break

            default:
                console.log("add", qaId, "setChange action")
        }
    };
    
    return (
        <FormControl className={classes.formControl}>
            <Select
                value={value}
                onChange={handleChange}
                displayEmpty
                className={classes.selectEmpty}
                style={styles}
            >
                {options.map((opt, idx) =>
                    <MenuItem key={idx} value={opt.key}>{opt.txt}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleSelect)