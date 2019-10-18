import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
    inputLabel: {
        fontWeight: "600",
        marginTop: "1rem"
    },
    flexLayout: {
        display: "flex",
        flexWrap: "wrap",
    justifyContent: "space-between"
    },
    textField: {
        width: "31%",
        height: 32
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
    }
}));

export default function TextFields(props) {
    const { question, labels, placeholder } = props;
    const { handleChange, params, answers, ss, tasks, setAnswers } = props;
    const classes = useStyles();

    // const [values, setValues] = React.useState({
    //     name: "Cat in the Hat"
    // });

    // const handleChange = name => event => {
    //     setValues({ ...values, [name]: event.target.value });
    // };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <InputLabel className={classes.inputLabel}>{question}</InputLabel>

            <div className={classes.flexLayout}>
                {labels.map((item, index) =>
                    <TextField
                        key={index}
                        id="standard-full-width"
                        label={item}
                        className={classes.textField}
                        placeholder={placeholder}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        onChange={(e) => handleChange(e, params[0], "textField", params[1], index, params[2], answers, ss, tasks, setAnswers)}
                        // fullWidth
                        // helperText="Full width!"
                    />
                )}
            </div>
            {/* <TextField
                id="standard-name"
                label="Name"
                className={classes.textField}
                value={values.name}
                onChange={handleChange("name")}
                margin="normal"
            />
            <TextField
                id="standard-uncontrolled"
                label="Uncontrolled"
                defaultValue="foo"
                className={classes.textField}
                margin="normal"
            />
            <TextField
                required
                id="standard-required"
                label="Required"
                defaultValue="Hello World"
                className={classes.textField}
                margin="normal"
            /> */}
        </form>
    );
}