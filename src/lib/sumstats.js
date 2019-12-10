import mean from 'compute-nanmean'
import median from 'compute-nanmedian'
import mode from 'compute-mode'
import stdev from 'compute-nanstdev'
import min from 'compute-nanmin'
import max from 'compute-nanmax'
import iqr from 'compute-iqr'
import q from 'compute-nanquantiles'
import kurtosis from 'compute-kurtosis'
import skew from 'compute-skewness'
import pcorr from 'compute-pcorr'
import mmean from 'compute-mmean'
import tversky from 'compute-tversky-index'
import shuffle from 'compute-shuffle'
import Complex from './complex'
import {getDateAnalysis} from './../data/typeDate'
import {getDateScaleValues} from './../data/typeDate'
import getSentence from './nlg/sentences'
import {statsByType} from './statsByType'
import { jsxClosingElement } from '@babel/types'

/*
    @param {keys} {header, type, [values], format}
    @param [cols] [{header, [values]}, ...n]
    @param id

    @return sumstats sentences
*/

export function getSumStats(data) {

    const keys = data.keys, cols = data.cols, id = data.id;

    const stats = statsByType(id);

    let sentenceList = [], questionList = [];
    
    cols.map(col => {

        let type = "country"; //getColumnType(col.header);
        let data = keys.values.map((d,i)=> d = {key:d, value: col.values[i]})
        let sumData = summarize(col.header, data, type, keys.type, ...stats);
        let sentences = [], questions = [];
        sumData.map(data => {
            let sentence = getSentence(data, "sentence");
            let question = getSentence(data, "questions");
            sentences.push(sentence);
            questions.push(question);
        })
        sentenceList.push(sentences);
        questionList.push(questions);
        
    });

    return {sentences: sentenceList, questions: questionList};

}

function summarize(col, data, type, keyType, ...stats) {

    stats = keyType != "date" ? stats.filter(a => a!=="roi"):stats;

    let sumstats = stats.map((d, i) => {

        const stat = d;
        const value = getValue(compute(d, data, keyType), data);

        if(stat==="roi")
        {
            let tvalue;
            if(value.length >0 || typeof value.data !== 'undefined' && value.data.length > 0)
            {
                tvalue = [];
                if(value.data[0].period !== null)
                {
                tvalue.push({column: col,
                    stat: "period",
                    statDefinition: "period",
                    id: "period",
                    value: value.data[0].period,
                    data: value.data[0],
                    type: type});
                }
                if(value.data[0].residualsOutliers!== null)
                {
                tvalue.push(value.data[0].residualsOutliers.map((v , i) => {
                    return{
                        column: col,
                        stat: "residuals",
                        statDefinition: "residuals outliers",
                        id: v.position,
                        value: v.residualValue,
                        value2: v.value,
                        data: v,
                        type: type,
                        additive: v.additive
                    }
                }));
                }
                if(value.data[0].upsDowns!== null)
                {
                tvalue.push(value.data[0].upsDowns.map((v , i) => {
                    return{
                        column: col,
                        stat: stat,
                        statDefinition: define(stat),
                        id: formatList([v.start.key, v.end.key]),
                        value: v.start.value,
                        compareValue: v.end.value,
                        data: v,
                        type: type
                    }
                }));
                }
                if(value.data[0].peaksAndTroughs!== null)
                {
                tvalue.push(value.data[0].peaksAndTroughs.map((v , i) => {
                    return{
                        column: col,
                        stat: "peaksAndTroughs",
                        statDefinition: "peaks and troughs",
                        id: v.position,
                        value: v.value,
                        kind: v.kind,
                        data: v,
                        type: type
                    }
                }));
                }
                /*tvalue.push(value.data[0].troughs.map((v , i) => {
                    return{
                        column: col,
                        stat: "troughs",
                        statDefinition: "troughs",
                        id: v.position,
                        value: v.value,
                        data: v,
                        type: type
                    }
                }));*/
                //separateInfo(tvalue);
            }
            else
            {
                tvalue = [];
            }
            return tvalue;
        }
        else
        {
            return {    
                column: col,
                stat: stat,
                statDefinition: define(stat),
                id: value.id,
                value: value.value,
                data: value.data,
                type: type
            }
        }

    });
    separateInfo(sumstats);
    return sumstats;

}

function separateInfo(array)
{
   /* array.forEach((d, i) => {
        if(Array.isArray(d)){
            d.forEach((d2, i2) => { 
                array.push(d2);
            })
            array.splice(i, 1);
            i--;
        }
    })*/
    let i, j;
    for(i=0; i<array.length; i++)
    {
        if(Array.isArray(array[i]))
        {
            for(j=0; j<array[i].length; j++)
            {
                array.push(array[i][j]);
            }
            array.splice(i,1);
            i--;
        }
    }

}

export function intersect(data1, data2, ...stats) {

    // const sumstats1 = stats.map((d, i) => getValue(compute(d, data1), data1).data);
    // const sumstats2 = stats.map((d, i) => getValue(compute(d, data1), data1).data);
    // console.log(leastSquares(data1.map(d=> d=d.value),data2.map(d=> d=d.value)))
}

 function leastSquares(x, y) {
     const lr = {};
     let n = y.length;
     let sum_x = x.reduce((a, b) => a + b, 0);
     let sum_y = y.reduce((a, b) => a + b, 0);
     let sum_xy = x.map((d, i) => x[i] * y[i]).reduce((a, b) => a + b, 0);
     let sum_xx = x.map((d) => d * d).reduce((a, b) => a + b, 0);
     let sum_yy = y.map((d) => d * d).reduce((a, b) => a + b, 0);

     lr.slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
     lr.intercept = (sum_y - lr.slope * sum_x) / n;
     lr.r2 = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);
     lr.residuals = y.map((d, i) => y[i] - (lr.intercept + lr.slope * x[i]))
     return lr;

}

function getValue(d, data) {

    let value = {};

    if (Array.isArray(d)) {
        if(d.length > 0)
        {
            value = { data: d, exists: true, id: formatList(d.map(d => d = d.key)), value: d[d.length - 1].value }
        }
    } else if (d === closest(d, data).value) {
        let match = closest(d, data);
        value = { data: match, exists: true, id: match.key, value: match.value }
    } else {
        let match = closest(d, data)
        //value = { data: { values: d, exists: false, closest: closest(d, data) }, id: match.key, value: d }
        value = { data: { values: d, exists: false, closest: closest(d, data) }, id: match.key, value: match.value }
    }

    return value;
}

function compute(stat, data, keyType) {

    const _data = (stat === 'percentile2' || stat === 'percentile98' || stat === 'outliers' || stat === 'roi') ? data.map((d, i) => i = { key: d.key, value: d.value}) : data.map((d, i) => i = d.value);

    switch (stat) {

        case 'mean': return mean(_data);
        case 'median': return median(_data);
        case 'mode': return mode(_data);
        case 'min': return min(_data);
        case 'max': return max(_data);
        case 'kurtosis': return kurtosis(_data);
        case 'skewness': return skew(_data);
        case 'outliers': return outliers(_data);
        case 'percentile2': return percentile(_data, 2);
        case 'percentile98': return percentile(_data, 98);
        case 'roi': return roi3(_data, keyType)
        // case 'lr': return lr(_data[0],_data[1]);
        //Need a multidimensional array
        case 'pcorr': return pcorr(data[0].map(d => d.value), data[1].map(d => d.value));
        default:
            return null;

    }

}

function outliers(data) {
    return data.filter(d => d <= (q(data, 4)[1] - iqr(data) * 1.5) || d >= (q(data, 4)[3] + iqr(data) * 1.5));
}

function closest(d, data) {
    return data.reduce((a, b) => (Math.abs(b.value - d) < Math.abs(a.value - d)) ? b : a)
}

function formatList(list) {
    if (list.length === 1) return list[0];
    else if (list.length === 2) return list.join(' and ');
    else if (list.length > 2) return list.slice(0, -1).join(', ') + ', and ' + list.slice(-1);
}

function define(stat) {
    const stats = ['mean', 'median', 'mode', 'min', 'max', 'kurtosis', 'skewness', 'outliers', 'percentile2', 'percentile98', 'roi'];
    const definition = ['average', 'median', 'most frequent value', 'lowest value', 'highest value', 'kurtosis', 'skewness', 'outliers', 'lowest', 'highest', 'region of interest'];
    const i = stats.findIndex(d => d === stat)
    return definition[i]
}

function percentile(data, p) {
    data = data.sort((a, b) => a.value - b.value);
    const i = Math.ceil(data.length * (p / 100)) - 1;
    let index = i;
    if (i < 1) index = 1;
    else if (i >= data.length - 1) index = data.length - 2;
    const _data = data.filter((d, i) => (p > 50) ? i > index : i < index);
    const sorted = (p > 50) ? _data.sort((a, b) => b.value - a.value) : _data.sort((a, b) => a.value - b.value);
    return sorted;
}

function pct(data, p) {
    data = data.sort((a, b) => a - b);
    const i = Math.ceil(data.length * (p / 100)) - 1;
    let index = i;
    if (i < 1) index = 1;
    else if (i >= data.length - 1) index = data.length - 2;
    const _data = data.filter((d, i) => (p > 50) ? i > index : i < index);
    const sorted = (p > 50) ? _data.sort((a, b) => b.value - a.value) : _data.sort((a, b) => a.value - b.value);
    return sorted[0];
}

function roi(data, keyType) {
    let result = [];
    if(keyType === "date")
    {
        if(data.length > 0){
            data.sort((a,b) => a.key - b.key);
        }
        //const key = data.map((d, i) => i = parseFloat(d.key.replace(",", ".")));
        let _data = data.map((d, i) => i = d.value);
    

        //let _cfft = _data.map((a,i) => a);
        
        //_cfft = cfft(_cfft);
        //let fft = _cfft.map((a,i) => Math.sqrt(a[0]*a[0]+a[1]*a[1]));
        //let period = findPeriod(fft);
        let trend, season, residuals;
        [trend, season, residuals] = getTimeSerieDecomposition(_data, "month");
        
        
        //let trend = applyAverageFilterWithPeriod(_data, period);
        //let _validData = _data.slice(((_data.length-trend.length)/2),data.length-(_data.length-trend.length)/2);
        //trend.unshift(_data[0]);
        //trend.push(_data[data.length-1])

        //let detrend = getDetrend(_validData, trend);
        //let season = getSeasonality(detrend, period);
        //let residuals = getResiduals(_validData, trend, season);

    
        //Attemp Smooth
        let dataSmooth = smoothData(data);
        let _dataSmooth = dataSmooth.map((d, i) => i = d.value);
    
        console.log("============================trend==========================")
        //trend.map((a,i) => console.log(a+";"));
        console.log(trend);
        //console.log("============================detrend==========================")
        //detrend.map((a,i) => console.log(a+";"));
        //console.log(detrend);
        console.log("============================season==========================")
        //season.map((a,i) => console.log(a+";"));
        console.log(season);
        console.log("============================residuals==========================")
        //residuals.map((a,i) => console.log(a+";"));
        console.log(residuals);
        //console.log("============================fft==========================")
        //fft.map((a,i) => console.log(a+";"));
        //console.log(fft);

    
        //let lr = leastSquares(key, _data);
        let tmin = min(_dataSmooth);
        let tmax = max(_dataSmooth);
        let tdif = tmax - tmin;
        let indexResult = 0;



        let index = 0;
        while(index < data.length-1)
        {
            let tslope = 0;
            let direction = _dataSmooth[index+1] - _dataSmooth[index];
            let follow = direction !== 0;
            let initialIndex = index;
            while(follow && index < _dataSmooth.length-1)
            {
                if((direction > 0 && _dataSmooth[index] <= _dataSmooth[index+1]) || (direction < 0 && _dataSmooth[index] >= _dataSmooth[index+1]))
                {
                    tslope = tslope + Math.abs(slope(data[index+1], data[index]));
                    index++;
                }
                else
                {
                    //if(direction < 0 && _data[index] >= _data[index+1])
                    //{
                    //    tslope = tslope + slope(data[index+1], data[index]);
                    //    index++;
                    //}
                    //else
                    //{
                        follow = false;
                        if(tslope > 0.1*tdif)
                        {
                            result[indexResult] = [data[initialIndex], data[index]];
                            indexResult++;
                        }
                        else{
                            index++;
                        }
                    //}
                }
            }
            if(index >= data.length-1)
            {
                if(tslope > 0.1*tdif)
                {
                    result[indexResult] = [data[initialIndex], data[index]];
                    indexResult++;
                }
            }
        }

        result.sort((a, b) => Math.abs(b[0].value-b[1].value) - Math.abs(a[0].value-a[1].value));
        /*
        const roi = data.filter((d, i) => 
        
        data = data.sort((a, b) => a.value - b.value);
        const i = Math.ceil(data.length * (p / 100)) - 1;
        let index = i;
        if (i < 1) index = 1;
        else if (i >= data.length - 1) index = data.length - 2;
        const _data = data.filter((d, i) => (d > 50) ? i > index : i < index);
        const sorted = (p > 50) ? _data.sort((a, b) => b.value - a.value) : _data.sort((a, b) => a.value - b.value);
        return sorted;*/
    }
    return result;
}

function roi2(data, keyType) {
    let result = [];
    if(keyType === "date")
    {
        if(data.length > 0){
            data.sort((a,b) => a.key - b.key);
        }

        autocorrelation = getAutoCorrelation(data);
        console.log(`autocorrelation: ${autocorrelation}`);
    
        //TODO: candidates depen on month, day, ...
        let period = getPeriodWithCandidates(autocorrelation, [3,4,12, 25, 365]);
        let period2 = getPeriod(autocorrelation);
        //TODO: aproximate period2 to a valid period

        let _data = data.map((d, i) => i = d.value);
        let additive = max(_data) >= 0 && min(_data) < 0;
        let trend, season, residuals;
        [trend, season, residuals] = getTimeSerieDecompositionWithPeriod(_data, period2, additive);
        if(validPeriod(period2, season, residuals))
        {
            //Attemp Smooth
            let dataSmooth = smoothData(data);
            let _dataSmooth = dataSmooth.map((d, i) => i = d.value);

            console.log("============================trend==========================")
            //trend.map((a,i) => console.log(a+";"));
            console.log(trend);
            //console.log("============================detrend==========================")
            //detrend.map((a,i) => console.log(a+";"));
            //console.log(detrend);
            console.log("============================season==========================")
            //season.map((a,i) => console.log(a+";"));
            console.log(season);
            console.log("============================residuals==========================")
            //residuals.map((a,i) => console.log(a+";"));
            console.log(residuals);
            //console.log("============================fft==========================")
            //fft.map((a,i) => console.log(a+";"));
            //console.log(fft);

            //let lr = leastSquares(key, _data);
            let tmin = min(_dataSmooth);
            let tmax = max(_dataSmooth);
            let tdif = tmax - tmin;
            let indexResult = 0;

            let index = 0;
            while(index < data.length-1)
            {
                let tslope = 0;
                let direction = _dataSmooth[index+1] - _dataSmooth[index];
                let follow = direction !== 0;
                let initialIndex = index;
                while(follow && index < _dataSmooth.length-1)
                {
                    if((direction > 0 && _dataSmooth[index] <= _dataSmooth[index+1]) || (direction < 0 && _dataSmooth[index] >= _dataSmooth[index+1]))
                    {
                        tslope = tslope + Math.abs(slope(data[index+1], data[index]));
                        index++;
                    }
                    else
                    {
                        //if(direction < 0 && _data[index] >= _data[index+1])
                        //{
                        //    tslope = tslope + slope(data[index+1], data[index]);
                        //    index++;
                        //}
                        //else
                        //{
                            follow = false;
                            if(tslope > 0.1*tdif)
                            {
                                result[indexResult] = [data[initialIndex], data[index]];
                                indexResult++;
                            }
                            else{
                                index++;
                            }
                        //}
                    }
                }
                if(index >= data.length-1)
                {
                    if(tslope > 0.1*tdif)
                    {
                        result[indexResult] = [data[initialIndex], data[index]];
                        indexResult++;
                    }
                }
            }

            result.sort((a, b) => Math.abs(b[0].value-b[1].value) - Math.abs(a[0].value-a[1].value));
        }
    }
    return result;
}


function roi3(data, keyType) {
    let result = [];
    if(keyType === "date")
    {
        if(data.length > 0){
            data.sort((a,b) => a.key - b.key);
        }
        let _data = data.map((d, i) => i = d.value);
        let trend, season, residuals;
        let trend2, season2, residuals2;
        let additive = max(_data) >= 0 && min(_data) < 0;
        let period = [... new Array(parseInt(0.9*data.length/2)-2)].map((d,i) => d = i+2 );
        for(let i = 0; i < period.length; i++)
        {
            [trend, season, residuals] = getTimeSerieDecompositionWithPeriod(_data, period[i], true);
            
            
            //[trend, season, residuals] = getTimeSerieDecompositionWithPeriod(_data, 12, true);

            //[trend2, season2, residuals2] = getTimeSerieDecompositionWithPeriod(_data, 12, false);

            
            //let aproximation = trend.map((a,i) => a+season[i]);
            //let aproximation2 = trend2.map((a,i) => a*season2[i]);

            //let squarediff = aproximation.map((a,i) =>(a-_data[i])*(a-_data[i])).reduce((a,b) => a+b,0)/_data.length;
            //let squarediff2 = aproximation2.map((a,i) =>(a-_data[i])*(a-_data[i])).reduce((a,b) => a+b,0)/_data.length;



            //let dif = tversky(aproximation,_data);
            //console.log(aproximation);
            //console.log(_data);

            let energy = energyDifference(period[i], season, residuals);
            console.log(period[i] + " " + energy );
            if( energy > 0 && isCandidatePeriod(period[i]))
            {
                [trend2, season2, residuals2] = getTimeSerieDecompositionWithPeriod(_data, period[i], false);
                console.log(trend2);
                console.log(season2);
                console.log(residuals2);
                let aproximation = trend.map((a,i) => a+season[i]);
                let aproximation2 = trend2.map((a,i) => a*season2[i]);
                let squarediff = aproximation.map((a,i) =>(a-_data[i])*(a-_data[i])).reduce((a,b) => a+b,0)/_data.length;
                let squarediff2 = aproximation2.map((a,i) =>(a-_data[i])*(a-_data[i])).reduce((a,b) => a+b,0)/_data.length;
                let additive = squarediff<squarediff2;
                if(squarediff<squarediff2)
                {
                    result.push({period: period[i], energy: energy, trend: trend, season: season, residuals: residuals});
                }
                else
                {
                    result.push({period: period[i], energy: energy, trend: trend2, season: season2, residuals: residuals2});
                }
            }
        }
        //result.map(d => console.log(d[0], d[1]));
        deleteMulptilePeriods(result);

        result.sort((a,b) => b.energy-a.energy);

        let dataSmooth;
        
        if(result.length === 0)
        {
            result.push({period: null, energy: null, trend: applyAverageFilterWithPeriod(data.map((d, i) => i = d.value), 0.1*data.length), season: null, residuals: null});
            //if it's necessary here we can calculate residuals as timeseries - trend
        }

        addFeatures(result, data, additive);

        //Attemp Smooth
        //let dataSmooth = smoothData(data);
        //let _dataSmooth = dataSmooth.map((d, i) => i = d.value);

        //console.log("============================trend==========================")
        //trend.map((a,i) => console.log(a+";"));
        //console.log(result[0].trend);
        //console.log("============================detrend==========================")
        //detrend.map((a,i) => console.log(a+";"));
        //console.log(detrend);
        //console.log("============================season==========================")
        //season.map((a,i) => console.log(a+";"));
        //console.log(season);
        //console.log("============================residuals==========================")
        //residuals.map((a,i) => console.log(a+";"));
        //console.log(residuals);
        //console.log("============================fft==========================")
        //fft.map((a,i) => console.log(a+";"));
        //console.log(fft);

            //let lr = leastSquares(key, _data);
            
    }
    return result;
}

//function addFeatures(result, data)
//{
    //result[0].period === null ? addFeaturesWithoutPeriod(result, data) : addFeaturesWithPeriod(result, data);
//    addFeaturesWithPeriod(result, data);
//}

function addFeatures(result, data, additive)
{
    let tmin = min(result[0].trend);
    let tmax = max(result[0].trend);
    let hasPeriod = result[0].period !== null;
    //let _dataSmooth = hasPeriod ? result[0].trend : applyAverageFilterWithPeriod(data.map((d, i) => i = d.value), 0.1*data.length);
    let _dataSmooth = result[0].trend;
    console.log(result[0].trend);
    console.log(result[0].season);
    console.log(result[0].residuals);
    let index = 0;
    let slopes = [];
    while(index < _dataSmooth.length-1)
    {
        let deltaY = 0;
        let direction = _dataSmooth[index+1] - _dataSmooth[index];
        let follow = true;
        let initialIndex = index;
        let x1,x2,li;
        while(follow && index < _dataSmooth.length-1)
        {
            if((direction >= 0 && _dataSmooth[index] <= _dataSmooth[index+1]) || (direction <= 0 && _dataSmooth[index] >= _dataSmooth[index+1]))
            {
                //let x2 = getDateScaleValues([data[index+1].key], getDateAnalysis([data[index+1].key]).format, getDateAnalysis([data[index+1].key]).hasDay);
                //let x1 = getDateScaleValues([data[index].key], getDateAnalysis([data[index].key]).format, getDateAnalysis([data[index].key]).hasDay);
                //tslope = tslope + (Math.abs(_dataSmooth[index+1] - _dataSmooth[index]))/(x2-x1);
                index++;
            }
            else
            {
                follow = false;
                deltaY = Math.abs(_dataSmooth[index+1] - _dataSmooth[initialIndex]);
                x2 = getDateScaleValues([data[index+1].key], getDateAnalysis([data[index+1].key]).format, getDateAnalysis([data[index+1].key]).hasDay);
                x1 = getDateScaleValues([data[initialIndex].key], getDateAnalysis([data[initialIndex].key]).format, getDateAnalysis([data[initialIndex].key]).hasDay);
                li = x2-x1;
                //slopes.push([data[initialIndex], data[index]]);
                slopes.push({start: data[initialIndex], end: data[index], slope: Math.atan2(deltaY,li)*Math.log(li) /*tslope*Math.log(index-initialIndex)*/, size: index-initialIndex});
                slopes[slopes.length-1].start.value = _dataSmooth[initialIndex];
                slopes[slopes.length-1].end.value = _dataSmooth[index];
            }
        }
        if(index >= data.length-1)
        {
            deltaY = Math.abs(_dataSmooth[index] - _dataSmooth[initialIndex]);
            x2 = getDateScaleValues([data[index].key], getDateAnalysis([data[index].key]).format, getDateAnalysis([data[index].key]).hasDay);
            x1 = getDateScaleValues([data[initialIndex].key], getDateAnalysis([data[initialIndex].key]).format, getDateAnalysis([data[initialIndex].key]).hasDay);
            li = x2-x1;
            slopes.push({start: data[initialIndex], end: data[index], slope: Math.atan2(deltaY,li)*Math.log(li) /*tslope*Math.log(index-initialIndex)*/, size: index-initialIndex});
            //slopes.push({start: data[initialIndex], end: data[index], slope: tslope*Math.log(index-initialIndex), size: index-initialIndex});
            slopes[slopes.length-1].start.value = _dataSmooth[initialIndex];
            slopes[slopes.length-1].end.value = _dataSmooth[index];
        }
    }
    slopes.sort((a, b) => Math.abs(b.slope/b.size) - Math.abs(a.slope/a.size) || b.size-a.size);
    //let slopesPercentil = percentile(slopes, 50);
    let slopesPercentil = slopes.slice(0, 6);
    slopesPercentil = slopesPercentil.filter(a => Math.abs(a.end.value - a.start.value) > 0.05*(tmax-tmin));
    //let startDate1 = getDateAnalysis([slopesPercentil[0].start.key]);
    //let startDate2 = getDateAnalysis([slopesPercentil[1].start.key]);
    //let startDate1Value = getDateScaleValues([slopesPercentil[0].start.key], startDate1.format, startDate1.hasDay);
    //let startDate2Value = getDateScaleValues([slopesPercentil[1].start.key], startDate2.format, startDate2.hasDay);
    slopesPercentil.sort((a, b) => getDateScaleValues([a.start.key], getDateAnalysis([a.start.key]).format, getDateAnalysis([a.start.key]).hasDay) - getDateScaleValues([b.start.key], getDateAnalysis([b.start.key]).format, getDateAnalysis([b.start.key]).hasDay));

    let residualsCopy = null;
    let residualsOutliers = null;

    if(hasPeriod)
    {
        console.log(Math.log(result[0].residuals[0]))
        residualsCopy = result[0].residuals.map((a,i) => i = {position: data[i].key, residualValue:additive?a:Math.log(a), value:data[i].value});
        //residualsCopy.sort((a, b) => Math.abs(b.residualValue) - Math.abs(a.residualValue));

        let residualsValues = residualsCopy.map(a => a.residualValue);
        let sdesviation = stdev(residualsValues);
        
        //if(!additive)
        //{
        //    residualsCopy = residualsCopy.map((a,i) => i = {position: a.position, residualValue: data[i].value - result[0].season[i] - result[0].trend[i], value: a.value})
        //}
        residualsOutliers = residualsCopy.filter(a => Math.abs(a.residualValue) > 2*sdesviation);

        residualsOutliers.sort((a, b) => Math.abs(b.residualValue) - Math.abs(a.residualValue));
        residualsOutliers = residualsOutliers.slice(0, 6);
        residualsOutliers.sort((a, b) => getDateScaleValues([a.position], getDateAnalysis([a.position]).format, getDateAnalysis([a.position]).hasDay) - getDateScaleValues([b.position], getDateAnalysis([b.position]).format, getDateAnalysis([b.position]).hasDay));

        if(!additive)
        {
            let cont;
            for (cont = 0; cont < residualsOutliers.length; cont++)
            {
                let index = data.findIndex(x => x.key === residualsOutliers[cont].position);
                residualsOutliers[cont].residualValue = data[index].value - result[0].season[index] - result[0].trend[index];
            }
        }
        
    }

    let peaksAndTroughs = slopesPercentil.map((a,i) => i = {position: a.end.key, value: a.end.value, kind: a.start.value < a.end.value ? "peak" : "trough"});

    let i;
    for(i = 0; i < peaksAndTroughs.length; i++)
    {
        let index = data.findIndex(x => x.key === peaksAndTroughs[i].position);
        let window = hasPeriod ? result[0].period : 0.1*data.length;
        let slice = data.slice(index-window/2, index+1+window/2);
        peaksAndTroughs[i].kind === "peak" ? slice.sort((a,b) => b.value - a.value): slice.sort((a,b) => a.value - b.value);
        peaksAndTroughs[i].position = slice[0].key;
        peaksAndTroughs[i].value = slice[0].value;
       //data.slice()
    }


    //let i;
    //let peaks = [];
    //let troughs = [];
    //for(i=0; i<slopesPercentil.length; i++)
    //{
    //    slopesPercentil[i].start.value > slopesPercentil[i].end.value ? troughs.push({position: slopesPercentil[i].end.key, value: slopesPercentil[i].end.value}):peaks.push({position: slopesPercentil[i].end.key, value: slopesPercentil[i].end.value});
    //}


    //console.log(slopesPercentil)
    //console.log(residualsPercentil)

    result[0] = {...result[0], upsDowns: slopesPercentil, residualsOutliers: residualsOutliers, peaksAndTroughs: peaksAndTroughs};//peaks: peaks, troughs:troughs};
}


function addFeaturesWithPeriodV2(result, data)
{
    let _dataSmooth = result[0].trend;
    let differences = [];
    let i;
    let j;
    for( i = 0; i < _dataSmooth.length-1; i++)
    {
        for(j = i+1; j < _dataSmooth.length; j++)
        {
            differences.push({start: data[i], end: data[j], slope: (_dataSmooth[j]-_dataSmooth[i]), size:(j-i)})
        }
    }
    deleteNestedSections(differences, false);

    differences.sort((a,b) => b.slope/b.size-a.slope/a.size)

    let differencesPercentile2 = percentile(differences, 2);
    let differencesPercentile98 = percentile(differences, 98);

    deleteNestedSections(differencesPercentile2, true);
    deleteNestedSections(differencesPercentile98, true);

    let differencesPercentile = differencesPercentile2.concat(differencesPercentile98);
    differencesPercentile.sort((a,b) => Math.abs(b.slope/b.size)-Math.abs(a.slope/a.size))

    let residualsCopy = result[0].residuals.map((a,i) => i = {index: i, value:a});
    let residualsPercentil2 = percentile(residualsCopy, 2);
    let residualsPercentil98 = percentile(residualsCopy, 98);

    result[0] = {...result[0], upsDowns: differencesPercentile, residualsPercentil2: null, residualsPercentil98: null};
    console.log(differences);
}

function addFeaturesWithoutPeriod(result, data)
{
    let differences = [];
    let i;
    let j;
    for( i = 0; i < data.length-1; i++)
    {
        for(j = i+1; j < data.length; j++)
        {
            differences.push({start: data[i], end: data[j], slope: (data[j].value-data[i].value), size:(j-i)})
        }
    }
    deleteNestedSections(differences, false);

    differences.sort((a,b) => b.slope/b.size-a.slope/a.size)

    let differencesPercentile2 = percentile(differences, 2);
    let differencesPercentile98 = percentile(differences, 98);

    deleteNestedSections(differencesPercentile2, true);
    deleteNestedSections(differencesPercentile98, true);

    let differencesPercentile = differencesPercentile2.concat(differencesPercentile98);
    differencesPercentile.sort((a,b) => Math.abs(b.slope/b.size)-Math.abs(a.slope/a.size))

    result[0] = {...result[0], upsDowns: differencesPercentile, residualsPercentil2: null, residualsPercentil98: null};
    console.log(differences);
}

function deleteNestedSections(differences, all)
{
    let i, j;
    for(i=0; i<differences.length; i++)
    {
        for(j = 0; j<differences.length; j++)
        {
            if(j!==i)
            {
                if(Math.sign(differences[j].slope) === Math.sign(differences[i].slope))
                {
                    if(isNested(differences[j], differences[i]))
                    {
                        if(all || (Math.abs(differences[j].slope/differences[j].size) < Math.abs(differences[i].slope/differences[i].size)))
                        {
                            differences.splice(j,1);
                            j--;
                        }
                    }
                    else
                    {
                        if(isNested(differences[i], differences[j]))
                        {
                            if(all || (Math.abs(differences[i].slope/differences[i].size) < Math.abs(differences[j].slope/differences[j].size)))
                            {
                                differences.splice(i,1);
                                j=-1;
                            }
                        }
                    }
                }
            }
        }
    }
}

function isNested(slopeA, slopeB)
{
    return (slopeA.start.key >= slopeB.start.key && slopeA.end.key <= slopeB.end.key) ? true : false;
}

function deleteMulptilePeriods(validPeriods)
{
    for(let i = 0; i < validPeriods.length-1; i++)
    {
        let j = i+1;
        while(j < validPeriods.length)
        {
            if(validPeriods[i].period%validPeriods[j].period === 0 || validPeriods[j].period%validPeriods[i].period === 0)
            {
                if(validPeriods[i].energy > validPeriods[j].energy)
                {
                    validPeriods.splice(j,1);
                }
                else
                {
                    validPeriods.splice(i,1);
                    j = i+1;
                }
            }
            else
            {
                j++;
            }
        }
    }
}

function isCandidatePeriod(period)
{
    let candidatePeriods = [3, 4, 6, 7, 12, 14, 30, 52, 90, 365];
    return candidatePeriods.includes(period);
}

function validPeriod(period, season, residuals)
{
    let energySeason = 0;
    let energyResiduals = 0;
    let i;
    for(i = 0; i < period; i++)
    {
        energySeason = energySeason + (season[i]-1)*(season[i]-1);
    }
    energySeason = energySeason/period;

    for(i = 0; i < residuals.length; i++)
    {
        energyResiduals = energyResiduals + (residuals[i])*(residuals[i]);
    }
    energyResiduals = energyResiduals/residuals.length;
    //TODO: test the th
    let th = energySeason + 0.25*energySeason;
    let result = th>energyResiduals;
    return result;
}

function energyDifference(period, season, residuals)
{
    let energySeason = 0;
    let energyResiduals = 0;
    let i;
    for(i = 0; i < period; i++)
    {
        energySeason = energySeason + (season[i])*(season[i]);
    }
    energySeason = energySeason/period;

    for(i = 0; i < residuals.length; i++)
    {
        energyResiduals = energyResiduals + (residuals[i])*(residuals[i]);
    }
    energyResiduals = energyResiduals/residuals.length;
    return energySeason-energyResiduals;
}

function getPeriod(autocorrelation)
{
    let sortedAutocorrelation = [...autocorrelation].slice(3,autocorrelation.length/2);
    sortedAutocorrelation.sort((a,b) => b-a);
    //sortedAutocorrelation.slice(3,autocorrelation.length/2).sort((a, b) => b.value - a.value);
    let i = 0;
    let exit = false;
    let period = 0;
    while(!exit && i < sortedAutocorrelation.length)
    {
        exit = isPeak(autocorrelation.indexOf(sortedAutocorrelation[i]), autocorrelation);
        i++;
    }
    if(exit)
        period = autocorrelation.indexOf(sortedAutocorrelation[i-1]);
    return period;
}

function getPeriodWithCandidates(autocorrelation, candidates)
{
    let values = candidates.map(d => autocorrelation[d]);
    values.sort((a,b) => b-a);

    let i = 0;
    let exit = false;
    let period = 0;
    while(!exit && i < values.length)
    {
        exit = isPeak(autocorrelation.indexOf(values[i]), autocorrelation);
        i++;
    }
    if(exit)
        period = autocorrelation.indexOf(values[i-1]);
    return period;
}

function isPeak(index, data)
{
    let result = false;
    if(index > 0 && index < data.length-1)
    {
        result = data[index] >= data[index-1] && data[index] >= data[index+1];
    }
    return result;
}

function getAutoCorrelation(data)
{
    let _rfft = data.map(d => d = d.value);
    //console.log(parseInt(_rfft.length/10));
    //TODO: this mmean works depend on the length of the period
    for(let i = 0; i<15; i++)
    {
        _rfft.unshift(_rfft[0]);
        _rfft.push(_rfft[_rfft.length-1]);
    }
    let trend = mmean(_rfft, 31);
    console.log(trend);
    //let trend = mmean(_rfft, 24);
    //let trend = _rfft;
    let slide = [parseInt((_rfft.length - trend.length)/2),trend.length + parseInt((_rfft.length - trend.length)/2)]
    let season = _rfft.slice(slide[0],slide[1]).map((d,i) => d-trend[i]);
    //console.log(trend);
    console.log(`season: ${season}`);
    //let _cfft = rfft(season);
    //let _cfft = rdft(season);
    let _cfft = rdft(trend);
    let fft = _cfft.map((a) => {
        const value = new Complex(Math.sqrt(a.re * a.re + a.im * a.im),0);
        return value;
    });
    //fft.map(a => console.log(a.re));
    //console.log(fft);
    //const inverse = ifft(fft);
    const inverse = idft(fft);
    //console.log(inverse);
    let autocorrelation = inverse.map(a => Math.sqrt(a.re * a.re + a.im * a.im));
    //console.log(m);
    return autocorrelation;
}

function getTimeSerieDecomposition(data, freq) {
    let tests;
    let amplitudes = [];

    switch(freq)
    {
        case "day":
            tests = [7, 14, 30, 90, 365];
        break;
        case "week":
            tests = [4, 12, 52];
        break;
        case "month":
            tests = [3, 4, 6, 12];
        break;
        default:
            tests = [... new Array(37)].map((d,i)=> d = i+3);
        break;
    }

    tests.map(test => {
        const _test_tsd = decompose(data, test)
        amplitudes.push(max(_test_tsd.season)-min(_test_tsd.season));
    });

    const period = tests[amplitudes.indexOf(max(amplitudes))];

    const tsd = decompose(data, period);

    return [tsd.trend, tsd.season, tsd.residuals];
}


function getTimeSerieDecompositionWithPeriod(data, period, additive) {

    const tsd = decompose(data, period, additive);

    return [tsd.trend, tsd.season, tsd.residuals];
}


function decompose(data, period, additive) {
    const trend = applyAverageFilterWithPeriod(data, period);
    const validData = data.slice(((data.length-trend.length)/2),data.length-(data.length-trend.length)/2);
    const detrend = additive ? getDetrendAdditive(validData, trend) : getDetrend(validData, trend);
    const season = getSeasonality(detrend, period);
    const residuals = additive ? getResidualsAdditive(validData, trend, season) : getResiduals(validData, trend, season);
    return {trend: trend, detrend: detrend, season: season, residuals: residuals};
}

function dft(samples, inverse) {
    let len = samples.length;
    let arr = Array(len);
    let pi2 = inverse ? Math.PI * 2 : Math.PI * (-2);
    let invlen = 1 / len;
    for (let i = 0; i < len; i++) {
      arr[i] = new Complex(0, 0);
      for (let n = 0; n < len; n++) {
        let theta = pi2 * i * n * invlen;
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        arr[i].re += samples[n].re * costheta - samples[n].im * sintheta;
        arr[i].im += samples[n].re * sintheta + samples[n].im * costheta;
      }
      if (!inverse) {
        arr[i].re *= invlen;
        arr[i].im *= invlen;
      }
    }
    return arr;
  }

//Ojo: s'ha de fer un slope ben fet tenint en compte si les x creixen de forma irregular
function slope(a, b){
    let result;
    const akey = parseFloat(a.key.replace(",", "."))
    const bkey = parseFloat(b.key.replace(",", "."))
    if(isNaN(akey) || isNaN(bkey) || akey - bkey === 0){
        result = a.value-b.value
    }
    else{
        result = (a.value-b.value)/(akey - bkey)
    }
    return result
}

function hasEnoughVariability(key, data){
    //TODO: try a th
    const th = 0;
    let sum = sumOfDifferences(key, data);
    return sum > th ? true : false;
}

function smoothData(data){
    let windows = 10;
    let result = [];
    //let smoothData = [...data];
    let smoothData = [];
    data.forEach((d) => {
        let key = d.key, value = d.value, keyType = d.keyType;
        let obj = {key:key, value:value, keyType:keyType}
        smoothData.push(obj)
    });
    let key = smoothData.map((d, i) => i = parseFloat(d.key.replace(",", ".")));
    let _data = smoothData.map((d, i) => i = d.value);
    windows = windows>smoothData.length?Math.round(smoothData.length/2):windows;

    result[0] = _data[0];
    let i;
    for(i = 0; i <= smoothData.length-3; i = i + windows - 2 ){
        let limit = i+windows;
        if(limit > smoothData.length){
            limit = smoothData.length;
        }
        let hasVariability = hasEnoughVariability(key.slice(i, limit), _data.slice(i, limit));
        if(hasVariability){
            result = result.concat(applyAverageFilter(_data.slice(i, limit)));
        }
        else{
            result = result.concat(_data.slice(i, limit));
        }
        //let lr = leastSquares(key.slice(i, i+windows), _data.slice(i, i+windows));
        //console.log(sum);
        //console.log(lr);
    }
    while(i<smoothData.length){
        result.push(_data[i]);
        i++;
    }

    smoothData.forEach((d,i) => d.value = result[i]);

    return smoothData;
}

function sumOfDifferences(key, data){
    let index = 0;
    let sum = 0;
    for(index = 0; index < data.length-1; index++){
        sum = sum + Math.abs(data[index+1]-data[index])+Math.abs(key[index+1]-key[index]);
    }
    return sum;
}

function applyAverageFilter(data){ 
    let moveMean = [];
    for (var i = 1; i < data.length-1; i++)
    {
        let mean = (data[i] + data[i-1] + data[i+1])/3.0;
        moveMean.push(mean);
    }
    return moveMean;
}

function applyAverageFilterWithPeriod(data, period){ 
    //let epsilon = 0.001;
    let moveMean = [];
    let windows = period%2 === 0 ? period+1 : period;
    let middlePoint = (windows-1)/2;

    let i;

    //for(i = 0; i< middlePoint; i++){
    //    moveMean.push(data[i]);
    //}

    //for (i = middlePoint; i < data.length-middlePoint; i++)
    for (i = 0; i < data.length; i++)
    {
        let start = i-middlePoint;
        let end = i+middlePoint+1;
        if(start < 0)
        {
            start = 0;
        }
        if(end >= data.length)
        {
            end = data.length-1;
        }
        let _mean = mean(data.slice(start, end));
        //_mean = Math.abs(_mean) < epsilon ? epsilon : _mean;
        moveMean.push(_mean);
    }

    //while(i< data.length){
    //    moveMean.push(data[i]);
    //    i++;
    //}

    return moveMean;
}

function getDetrend(timeseries, trend){
    //let epsilon = 0.001;
    //let detrend = timeseries.map((a,i) => Math.abs(trend[i]) > epsilon ? a/trend[i]: epsilon);
    let detrend = timeseries.map((a,i) => trend[i] !== 0 ? a/trend[i]: a);
    return detrend;
}

function getDetrendAdditive(timeseries, trend){
    //let epsilon = 0.001;
    //let detrend = timeseries.map((a,i) => Math.abs(trend[i]) > epsilon ? a/trend[i]: epsilon);
    let detrend = timeseries.map((a,i) => a-trend[i]);
    return detrend;
}

function getSeasonality(detrend, period){
    let windows = period;
    let i = 0;
    let j = 0;
    let seasonality = [];
    if(windows > detrend.length){
        windows = detrend.length;
    }
    for(i = 0; i<windows; i++)
    {
        seasonality[i] = 0;
        let count = 0;
        for(j = i; j<detrend.length; j = j + windows){
            seasonality[i] = seasonality[i]+detrend[j];
            count++
        }
        seasonality[i] = count !== 0 ? seasonality[i]/count : seasonality[i];
    }
    j=0;
    for(i = seasonality.length; i < detrend.length; i++){
        if(j>=windows){
            j=0;
        }
        seasonality.push(seasonality[j]);
        j++;
    }
    return seasonality;
}

function getResiduals(timeseries, trend, season){
    let trendPerSeason = trend.map((a,i) => a*season[i]);
    let residuals = timeseries.map((a,i)=> trendPerSeason[i] !== 0 ? a/trendPerSeason[i]:1);
    return residuals; 
}

function getResidualsAdditive(timeseries, trend, season){
    let residuals = timeseries.map((a,i) => a - trend[i] - season[i])
    //let trendPerSeason = trend.map((a,i) => a*season[i]);
    //let residuals = timeseries.map((a,i)=> trendPerSeason[i] !== 0 ? a/trendPerSeason[i]:1);
    return residuals; 
}

function findPeriod(data){
    const peaks = data.filter((d,i)=> (d >= 3*stdev(data))&&(i>0));
    return data.indexOf(peaks[0])+1;
}

function cfft(data)
{
    let N = data.length;
    N = previouspow2(N);
    //let np = nextpow2(N);
    //data = data.concat(Array(np-N).fill(new Complex(0,0)));
    let datapow2  = data.slice(0, N);
    return recursivecfft(datapow2);
}

function recursivecfft(data)
{
    let N = data.length;
    if( N <= 1 )
        return data;
        
 
    let hN = Math.floor(N / 2);
    N = hN*2;
    let even = [];
    let odd = [];
	even.length = Math.floor(hN);
	odd.length = Math.floor(hN);
	for(let i = 0; i < hN; ++i)
	{
		even[i] = data[i*2];
		odd[i] = data[i*2+1];
	}
	even = cfft(even);
	odd = cfft(odd);
 
	let a = -2*Math.PI;
	for(let k = 0; k < hN; ++k)
	{   
        let p = k/N;
		let t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		data[k] = even[k].add(t, odd[k]);
		data[k + hN] = even[k].sub(t, even[k]);
    }
    return data;
}

function rfft(data)
{

    let cdata = data.map(d => new Complex(d, 0));

	return cfft(cdata);
}

function rdft(data)
{

    let cdata = data.map(d => new Complex(d, 0));

	return dft(cdata, false);
}

function idft(data)
{
    return dft(data, true);
}

function ifft(signal){
    let N = signal.length;
    let csignal;
    csignal = signal.map(d => new Complex(d.re, -d.im));
    // // for( let i=0; i<N; i++ ){
    // //     csignal[i] = [signal[i][1], signal[i][0]];
    // // }

    // // let _csignal = patata.map(d=> d)
    // let _ps = cfft(csignal);
    // let _re = _ps.map(d => Math.sqrt(d.re * d.re + d.im * d.im));
    // return _re;

    // res[j]=[ps[j][1]/ps.length, ps[j][0]/ps.length];
    //Interchange real and imaginary parts
    // let csignal = [];
    // signal.map(d=> {
    //     let a = d.im;
    //     let b = d.re;
    //     let arr = new Complex(a,b)
    //     csignal.push(arr);
    // })
    //Apply fft
    let ps = cfft(csignal);
    console.log(ps)
    // //Interchange real and imaginary parts and normalize
     let res = [];
     ps.map(d=> res.push(new Complex(d.re/N, -d.im/N)))
     return res;
}   

function autocorrelation(signal) {
        
    const n = signal.length;
    let i;
    const n2 = nextpow2(n);

    if ( n === 0 ) n2 = 0;
    
    let paddedSignal = [];
    
    if (n==n2) paddedSignal = signal;

    else {
        for (let i = 0; i < n2; i++){
            if (i<n){
                paddedSignal[i]=signal[i];
            }
            else{
                paddedSignal[i]=0;
            }
        }
    }

    let acv = autocovariance(paddedSignal);
    
    let variance = acv[0];
    
    let acf = [];
    
    if ( variance > 0 ){

        for (let i = 0; i < n; i++){
            acf[i] = acv[i] / variance;    
        }
    }
    else {

        for (let i = 0; i < n; i++){
            acf[i] = 0;    
        }            
    }

    return acf;
}

function autocovariance(signal) {
        
    let n = signal.length;

    if ( n === 0 ) return [];

    let mean = 0;
    let i;
    for (let i = 0; i < n; i++){
        mean += signal[i];
    }
    mean /= n;
            
    let padded_signal = [];

    for (let i = 0; i < n; i++){
        padded_signal[i]=signal[i]-mean;
        padded_signal[n+i]=0;
    }
                
    let ft_signal = cfft(padded_signal);

    let pseudo_powerSpectralDensity = [];

    for (i=0; i<ft_signal.length; i++){
        pseudo_powerSpectralDensity[i] = complexMultiply(ft_signal[i], complexConjugate(ft_signal[i]));
    }

    let pseudo_autocovariance = ifft(pseudo_powerSpectralDensity);

    let mask = [];

    for (let i = 0; i < n; i++){
        mask[i] = 1;
        mask[i+n] = 0;
    }

    let ft_mask = cfft(mask);

    let mask_powerSpectralDensity = [];

    for ( let i=0; i<ft_mask.length; i++ ){
        mask_powerSpectralDensity[i] = complexMultiply(ft_mask[i], complexConjugate(ft_mask[i]));
    }

    let mask_correction_factors = ifft(mask_powerSpectralDensity);

    let acv = [];

    for (i=0; i<n; i++){
        acv[i] = complexDivideRealPart(pseudo_autocovariance[i], mask_correction_factors[i]);
    }

    return acv;        

}

function complexMultiply(a, b){
    return [(a[0] * b[0] - a[1] * b[1]), 
            (a[0] * b[1] + a[1] * b[0])];
}

function complexConjugate(a){
    return [a[0], -a[1]]
}

function complexDivideRealPart(a,b){ 
    return (a[0]*b[0]+a[1]*b[1])/(b[0]*b[0]+b[1]*b[1])
}

function nextpow2(v) {
    v += v === 0;
    --v;
    v |= v >>> 1;
    v |= v >>> 2;
    v |= v >>> 4;
    v |= v >>> 8;
    v |= v >>> 16;
    return v + 1;
}

function previouspow2(v) {
    if (v == 0) {
        return 0;
    }
    // v--; Uncomment this, if you want a strictly less than 'v' result.
    v |= (v >> 1);
    v |= (v >> 2);
    v |= (v >> 4);
    v |= (v >> 8);
    v |= (v >> 16);
    return v - (v >> 1);
}