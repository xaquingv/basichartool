import mean from 'compute-nanmean'
import median from 'compute-nanmedian'
import mode from 'compute-mode'
import min from 'compute-nanmin'
import max from 'compute-nanmax'
import iqr from 'compute-iqr'
import q from 'compute-nanquantiles'
import kurtosis from 'compute-kurtosis'
import skew from 'compute-skewness'
import pcorr from 'compute-pcorr'

export function summarize(col, data, type, ...stats) {

    let sumstats = stats.map((d, i) => {

        const stat = d;
        const value = getValue(compute(d, data), data);

        if(stat==="roi")
        {
            const tvalue = value.data.map((v , i) => {
                return{
                    column: col,
                    stat: stat,
                    statDefinition: define(stat),
                    id: formatList(v.map(v => v = v.key)),
                    value: v[0].value,
                    compareValue: v[1].value,
                    data: v,
                    type: type
                }
            })
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
    //console.log(sumstats);
    return sumstats;

}

function separateInfo(array)
{
    array.forEach((d, i) => {
        if(Array.isArray(d)){
            d.forEach((d2, i2) => { 
                array.push(d2);
            })
            array.splice(i, 1);
        }
    })
}

export function intersect(data1, data2, ...stats) {

    // const sumstats1 = stats.map((d, i) => getValue(compute(d, data1), data1).data);
    // const sumstats2 = stats.map((d, i) => getValue(compute(d, data1), data1).data);
    // console.log(leastSquares(data1.map(d=> d=d.value),data2.map(d=> d=d.value)))
}

// function leastSquares(x, y) {
//     const lr = {};
//     let n = y.length;
//     let sum_x = x.reduce((a, b) => a + b, 0);
//     let sum_y = y.reduce((a, b) => a + b, 0);
//     let sum_xy = x.map((d, i) => x[i] * y[i]).reduce((a, b) => a + b, 0);
//     let sum_xx = x.map((d) => d * d).reduce((a, b) => a + b, 0);
//     let sum_yy = y.map((d) => d * d).reduce((a, b) => a + b, 0);

//     lr.slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
//     lr.intercept = (sum_y - lr.slope * sum_x) / n;
//     lr.r2 = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);
//     lr.residuals = y.map((d, i) => y[i] - (lr.intercept + lr.slope * x[i]))
//     return lr;
// }

function getValue(d, data) {

    let value = {};

    if (Array.isArray(d)) {
        value = { data: d, exists: true, id: formatList(d.map(d => d = d.key)), value: d[d.length - 1].value }
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

function compute(stat, data) {

    const _data = (stat === 'percentile2' || stat === 'percentile98' || stat === 'outliers' || stat === 'roi') ? data.map((d, i) => i = { key: d.key, value: d.value, keyType: d.keyType }) : data.map((d, i) => i = d.value);

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
        case 'roi': return roi(_data)
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

function roi(data) {
    if(data.length > 0 && data[0].keyType === "date"){
        data.sort((a,b) => a.key - b.key);
    }
    let _data = data.map((d, i) => i = d.value);
    let tmin = min(_data);
    let tmax = max(_data);
    let tdif = tmax - tmin;
    let result = [];
    let indexResult = 0;



    let index = 0;
    while(index < data.length-1)
    {
        let tslope = 0;
        let direction = _data[index+1] - _data[index];
        let follow = direction !== 0;
        let initialIndex = index;
        while(follow && index < _data.length-1)
        {
            if((direction > 0 && _data[index] <= _data[index+1]) || (direction < 0 && _data[index] >= _data[index+1]))
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
    return result;

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

function slope(a, b){
    let result;
    const akey = parseFloat(a.key.replace(",", "."))
    const bkey = parseFloat(b.key.replace(",", "."))
    if(isNaN(akey) || isNaN(bkey)){
        result = a.value-b.value
    }
    else{
        result = (a.value-b.value)/(akey - bkey)
    }
    return result
}
