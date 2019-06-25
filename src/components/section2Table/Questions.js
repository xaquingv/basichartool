import React from 'react';
import { connect } from 'react-redux'
import sumstats from '../../lib/sumstats'
import sentence from '../../lib/nlg/sentences'

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

let answers = {
    gdp: []
}
const typeSumstats = ["min", "mean", "median", "max"]

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

class Section extends React.Component {

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
        const dataStats = dataChart.numberCols.map((col, idx) => {
            // params: col header, data, type of sumstats1, 2, 3, ///
            return sumstats(
                dataChart.keys[idx],
                col.map((value, index) => ({ key: keys[index], value })),
                ...typeSumstats
            )
        })

        dataStats.forEach(d => {
            console.log(d);
        })

        const handleChange = (who) => {
            console.log(who);
        }

        

        //return null
        return (
            <div className="questions">
                <p className="mt-30">Question 1: Do you want to highlight the correlation between gdp and life expectancy?</p>
                <p className="mt-30">Question 2:</p>
                {dataStats.map((dataList, idx) =>
                    <div key={"qh-" + idx}>
                        <p className="question-header">{dataList[0].column}</p>
                        {dataList.map((data, i) =>
                            // <div key={"qa-" + idx + i}>
                            // <FormControlLabel
                            //     control={<Switch checked={answers['gdp']} onChange={handleChange('gdp')} value="gdp" />}
                            //     label={sentence(data)}
                            // />
                            // </div>
                            <p key={"qa-" + idx + i}>{sentence(data)}</p>
                        )}
                    </div>
                )}
                <p className="mt-30">Question 3: Are you focusing on some specific country or a group of them?</p>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Section)