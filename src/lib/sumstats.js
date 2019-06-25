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

const statsToDefinition = {
    mean: 'average',
    median: 'median', 
    mode: 'most frequent value', 
    min: 'lowest value', 
    max: 'highest value', 
    kurtosis: 'kurtosis', 
    skewness: 'skewness', 
    outliers: 'outliers', 
    percentile2: 'lowest values', 
    percentile98: 'highest values'
}

function getValue(d, data) {
    let value = {};
    
    if (Array.isArray(d)) {
        value = { data: d, exists: true, id: formatList(d.map(d => d = d.key)), value: d[d.length - 1].value }
    } else if (d === closest(d, data).value) {
        let match = closest(d, data);
        value = { data: match, exists: true, id: match.key, value: match.value }
    } else {
        let match = closest(d, data)
        value = { data: { values: d, exists: false, closest: closest(d, data) }, id: match.key, value: d }
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

function percentile(data, p) {
    data = data.sort((a, b) => a.value - b.value);
    const index = Math.ceil(data.length * (p / 100)) - 1;
    return data.filter((d, i) => (p > 50) ? i > index : i < index);
}

export default function (col, data, ...stats) {

    const sumstats = stats.map((d, i) => {

        const stat = d;
        const value = getValue(compute(d, data), data);
        
        return {
            column: col,
            stat: stat,
            statDefinition: statsToDefinition[stat],
            id: value.id,
            value: value.value,
            data: value.data
        }
    });
    return sumstats;
}