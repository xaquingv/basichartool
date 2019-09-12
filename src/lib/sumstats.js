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

    const sumstats = stats.map((d, i) => {

        const stat = d;
        const value = getValue(compute(d, data), data);

        return {
            column: col,
            stat: stat,
            statDefinition: define(stat),
            id: value.id,
            value: value.value,
            data: value.data,
            type: type
        }

    });

    return sumstats;

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

    const _data = (stat === 'percentile2' || stat === 'percentile98' || stat === 'outliers') ? data.map((d, i) => i = { key: d.key, value: d.value }) : data.map((d, i) => i = d.value);

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
        // case 'lr': return lr(_data[0],_data[1]);
        //Need a multidimensional array
        case 'pcorr': return pcorr(data[0].map(d => d.value), data[1].map(d => d.value));
        default:
            return null;

    }

}

// function getRow(data, stat, value) {

//     if (stat === 'mean' || stat === 'median' || stat === 'mode' || stat === 'min' || stat === 'max') {
//         return closest(value, data)
//     } else {
//     }
// }

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
    const stats = ['mean', 'median', 'mode', 'min', 'max', 'kurtosis', 'skewness', 'outliers', 'percentile2', 'percentile98'];
    const definition = ['average', 'median', 'most frequent value', 'lowest value', 'highest value', 'kurtosis', 'skewness', 'outliers', 'lowest', 'highest'];
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

// const statsToDefinition = {
//     mean: 'average',
//     median: 'median',
//     mode: 'most frequent value',
//     min: 'lowest value',
//     max: 'highest value',
//     kurtosis: 'kurtosis',
//     skewness: 'skewness',
//     outliers: 'outliers',
//     percentile2: 'lowest',
//     percentile98: 'highest'
// }