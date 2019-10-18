import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { minWidth } from "@material-ui/system";
// import Select from "@material-ui/core/Select";
/* note that <Select native /> has a much smaller bundle size footprint than <NativeSelect> */
// import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  // root: {
  // },
  inputLabel: {
    fontWeight: "600",
    marginTop: "1rem"
  },
  flexLayout: {
    display: "inline-flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    minWidth: 150
  },
  formControl: {
    // width: "31%"
  },
}));

export default function SelectComponent(props) {
  const classes = useStyles();
  const { options, index } = props
  // const handleChange = index => event => {
  //   optionValues[index] = event.target.value;
  //   //***console.log(optionValues[index]);
  // };

  return (
    <div className={classes.flexLayout}>
      <FormControl className={classes.formControl}>
        <NativeSelect defaultValue={options[index]} >
          {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </NativeSelect>
      </FormControl>

      {/* <FormControl key={"2"} className={classes.formControl}>
        <InputLabel htmlFor="native-simple">{dimensions[2]}</InputLabel>
        <Select
          native
          value={optionValues[2]}
          onChange={handleChange(2)}
        >
          {options.map(opt => <option value={opt}>{opt}</option>)}
        </Select>
        <FormHelperText>More Info</FormHelperText>
      </FormControl> */}

      {/* <TextField
        id="standard-select-currency"
        select
        label="Select"
        className={classes.textField}
        value={values.currency}
        onChange={handleChange('currency')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText="Please select your currency"
        margin="normal"
      >
        {currencies.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}
    </div>
  );
}
