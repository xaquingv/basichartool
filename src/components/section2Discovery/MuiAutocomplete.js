import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

export default function AutocompleteTextField(props) {
    const { options, isSingle, value, setChange } = props;
    const flatProps = {
        options: options.map(option => option.txt)
    };

    const classes = useStyles();
    const [valueSingle, setValue] = React.useState(null);

    const handleChangeSingle = (event, newValue) => {
        setValue(newValue);
    }
    const handleChangeMultiple = (event, newValue) => {
        setChange(newValue);
    }

    return isSingle ? (
        <Autocomplete
            {...flatProps}
            value={valueSingle || options[0].txt}
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