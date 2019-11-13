import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
    flexLayout: {
        display: "inline-flex",
        // flexWrap: "wrap",
        // justifyContent: "space-between"
    },
    textField: {
        // width: "31%",
        height: 32
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
    }
}));

export default function TextFieldComponent(props) {
    // const { labels, placeholder } = props;
    const { index, helpText, placeholder } = props;
    const { handleChange, params, answers, ss, tasks, setAnswers } = props;
    const classes = useStyles();

    // const [values, setValues] = React.useState({
    //     name: "Cat in the Hat"
    // });

    // const handleChange = name => event => {
    //     setValues({ ...values, [name]: event.target.value });
    // };

    return (
        // <form className={classes.flexLayout} noValidate autoComplete="off">
        <div className={classes.flexLayout}>
            <TextField
                key={index}
                id="standard-full-width"
                className={classes.textField}
                margin="normal"
                placeholder={placeholder}
                InputLabelProps={{
                    shrink: true
                }}
                onChange={(e) => handleChange(e, params[0], "textField", params[1], index, params[2], answers, ss, tasks, setAnswers)}
                helperText={helpText}
            />

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
        </div>
    );
}