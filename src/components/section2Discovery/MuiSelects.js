import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// ref: codesandbox.io/s/material-demo-35ywt

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

export default function SimpleSelect(props) {
    const { options, value, setChange, qaId, data, styles } = props;
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
                setChange(newValue)
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