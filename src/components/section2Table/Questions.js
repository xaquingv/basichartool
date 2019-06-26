import React from 'react'
import { connect } from 'react-redux'
import './questions.css'
import sumstats from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import MenuItem from "@material-ui/core/MenuItem"
import InputAdornment from '@material-ui/core/InputAdornment'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import ComponentSelectMultiple from './SelectMultiple'

let answers = {
    gdp: true
}
const columns = [
    {
        value: "X-AXIS",
        label: "X-AXIS"
    },
    {
        value: "Y-AXIS",
        label: "Y-AXIS"
    },
    {
        value: "SIZE",
        label: "SIZE"
    }
];
const typeSumstats = ["min", "mean", "median", "max"]

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

class Questions extends React.Component {

    render() {
        const { dataChart } = this.props
        if (!dataChart) { return null; }
        console.log(dataChart)
        if (dataChart.string1Col.length < 1 || dataChart.numberCols.length < 1) { return null; }

        /* example:
        const data = [...new Array(201)].map((d, i)=> {
        return i = {key: Math.random().toString(36).substring(2, 15), value: Math.random()}; });
        const stats = sumstats('column', data, 'mean', 'median', 'percentile98');
        console.log(stats);*/

        const keys = dataChart.string1Col
        const dataKeys = keys.map(key => ({
            label: key,
            value: key
        }))
        const dataStats = dataChart.numberCols.map((col, idx) => {
            // params: col header, data, type of sumstats1, 2, 3, ///
            return sumstats(
                dataChart.keys[idx],
                col.map((value, index) => ({ key: keys[index], value })),
                ...typeSumstats
            )
        })

        const handleChange = (who) => {
            console.log("change:", who);
        }

        const switchComponent = (key, label, style = {}) => {
            return (
                <div key={"qa-" + key}>
                    <FormControlLabel
                        control={<Switch
                            checked={false}
                            onChange={handleChange('gdp')}
                            value="gdp"
                            color="primary"
                        />}
                        label={label}
                        style={style}
                    />
                </div>
            );
        }

        const textFieldComponent = (label, rowNumber, style = {}) => {
            //const width = 33 * (rowNumber === 1 ? 1 : 2) + "%";
            return (
                <TextField
                    // id="standard-multiline-flexible"
                    label={label}
                    multiline
                    rowsMax={rowNumber}
                    // value={values.multiline}
                    placeholder="Please type your answer here, or leave it empty to skip."
                    onChange={handleChange('multiline')}
                    // className={classes.textField}
                    margin="normal"
                    style={{ width: "66%", ...style }}
                    InputLabelProps={{ shrink: true, }}
                />
            )
        }

        const selectComponent = (start, index) => {
            const marginRight = (index + 1) % 3 !== 0 ? "2%" : "0"
            return (
                <TextField
                    select
                    label="Change your mapping"
                    // className={clsx(classes.margin, classes.textField)}
                    value={columns[index].label}
                    onChange={handleChange('weightRange')}
                    style={{ width: "32%", marginRight: marginRight }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{start + " :"}</InputAdornment>,
                    }}
                >
                    {columns.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )
        }

        const animatedComponents = makeAnimated();
        const selectMultipleComponent = (label) => {
            return (
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={dataKeys[0]}
                  isMulti
                  options={dataKeys}
                />
              );
        }
        
        return (
            <div className="questions">
                <p className="mt-30">Question set 1:</p>
                {selectComponent("gdp", 0)}
                {selectComponent("life expectancy", 1)}
                {selectComponent("population", 2)}
                {switchComponent(0, "Do you want to highlight the correlation between gdp and life expectancy?", { marginTop: "8px" })}
                <p className="mt-30 mb-5">Question set 2: statistical summary</p>
                {dataStats.map((dataList, idx) =>
                    <div key={"qh-" + idx} className="mb-5">
                        <p className="question-header"><u>{dataList[0].column}</u></p>
                        {textFieldComponent("What are the " + dataList[0].column + " numbers referring to? (e.g. dollars, people, years ...)", 1)}
                        {dataList.map((data, i) => switchComponent(idx + i, sentence(data)))}
                    </div>
                )}
                {textFieldComponent("Why do Australia, Japan, Spain, Switzerland have such a high life expentancy?", 3, { marginTop: "8px" })}
                <p className="mt-30">Question set 3:</p>
                {textFieldComponent("Are you focusing on some specific country or a group of them?", 3)}
                {/* <ComponentSelectMultiple dataKeys={dataKeys} label="Are you focusing on some specific country or a group of them?" /> */}
                {/* {selectMultipleComponent("Are you focusing on some specific country or a group of them?")} */}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions)