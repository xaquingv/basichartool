import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

const phSet1 = "Required*"
const phSet2 = "Please type your answer here, or leave it empty to skip."

// match 0 or more chars in {} (curly braces)
const regAnyInCB = /{([^}]*)}/ 

const useStyles = makeStyles(theme => ({
    flexLayout: {
        display: "inline-flex",
        // flexWrap: "wrap",
        // justifyContent: "space-between"
    },
    textFieldSet1: {
        // width: "31%",
        // height: 32
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
    },
    textFieldSet2: {
        width: "66%", 
        minWidth: "600px", 
        marginTop: "5px", 
        marginLeft: "46px"
    }
}));

export default function TextFieldComponent(props) {
    const { qaId, defaultValue, helpText, label} = props;
    const { setChange, data } = props;

    const classes = useStyles();
    const [value, setValue] = React.useState(defaultValue || "");
    const handleChange = event => {
        const value = isSet1 ? event.target.value.trim() : event.target.value
        setValue(value);
    };

    const isSet1 = qaId !== "set2";
    const index = isSet1 ? [] : data.index;
    const replaceText = (originEdit, value) => {
        const newText = originEdit.map(s => s.replace(regAnyInCB, (value !== "" ? value : "{units}"))); 
        return newText
    }
    const handleBlur = event => {
        const value = event.target.value.trim();
        if (!value) return
        //console.log("onBlur:", value);
        
        if (isSet1) {
            const {sentences, questions, index, isOnlyTF} = data;
            let newSentences = {...sentences};
            let newQuestions = {...questions};
            // only one textfield
            if (isOnlyTF) {
                newSentences.text = sentences.edit.map(ss => replaceText(ss, value));
                newQuestions.text = questions.edit.map(qss => qss.map(qs => replaceText(qs, value)));
            // 2 or 3 textfields, case of plot     
            } else {
                newSentences.text[index] = replaceText(sentences.edit[index], value);
                newQuestions.text[index] = questions.edit[index].map(qs => replaceText(qs, value));
            }
            setChange(newSentences, newQuestions);
        } else {
            // ui
            setValue(value);
            // datastore
            const newAnswers = { ...data.answers };
            newAnswers.textfields[index[0]][index[1]][index[2]] = value;
            setChange(newAnswers);
        }
    }

    return (
        // <form className={classes.flexLayout} noValidate autoComplete="off">
        <div className={classes.flexLayout}>
            <TextField
                key={index.join("")}
                multiline
                rowsMax={isSet1 ? 1 : 3}
                className={isSet1 ? classes.textFieldSet1 : classes.textFieldSet2}
                label={label} 
                placeholder={isSet1 ? phSet1 : phSet2}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={helpText || " "}
                InputLabelProps={{ shrink: true, }}
            />
        </div>
    );
}