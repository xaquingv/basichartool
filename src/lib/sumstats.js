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
import Complex from './complex'
import getSentence from './nlg/sentences'

/*
    @param {keys} {header, type, [values], format}
    @param [cols] [{header, [values]}, ...n]
    @param id

    @return sumstats sentences
*/

export function getSumStats(keys, cols, id) {

    const stats = getListOfStats(id);
    let sentences = [];
    
    cols.map(col => {
        // const type = getColumnType(col.header);
        let sumData = summarize(col.header, col.values, type, keys.type, ...stats);
        let sentence = getSentence(sumData, "sentence");
        sentences.push(sentence);
    });

    console.log(sentences.flat());

    return sentences.flat();

}

function summarize(col, data, type, keyType, ...stats) {

    stats = keyType != "date" ? stats.filter(a => a!=="roi"):stats;

    let sumstats = stats.map((d, i) => {

        const stat = d;
        const value = getValue(compute(d, data, keyType), data);

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
        case 'roi': return roi(_data, keyType)
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
        //let fft = _cfft.map((a,i) => Math.sqrt(a.re*a.re+a.im*a.im));
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
            tests = [3, 6, 12];
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

function decompose(data, period) {
    const trend = applyAverageFilterWithPeriod(data, period);
    const validData = data.slice(((data.length-trend.length)/2),data.length-(data.length-trend.length)/2);
    const detrend = getDetrend(validData, trend);
    const season = getSeasonality(detrend, period);
    const residuals = getResiduals(validData, trend, season)
    return {trend: trend, detrend: detrend, season: season, residuals: residuals};
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
    let moveMean = [];
    let windows = period%2 === 0 ? period+1 : period;
    let middlePoint = (windows-1)/2;

    let i;

    //for(i = 0; i< middlePoint; i++){
    //    moveMean.push(data[i]);
    //}

    for (i = middlePoint; i < data.length-middlePoint; i++)
    {
        let _mean = mean(data.slice(i-middlePoint, i+middlePoint+1));
        moveMean.push(_mean);
    }

    //while(i< data.length){
    //    moveMean.push(data[i]);
    //    i++;
    //}

    return moveMean;
}

function getDetrend(timeseries, trend){
    let detrend = timeseries.map((a,i) => a/trend[i]);
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
        seasonality[i] = seasonality[i]/count;
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
    let residuals = timeseries.map((a,i)=> a/trendPerSeason[i]);
    return residuals; 
}

function findPeriod(data){
    const peaks = data.filter((d,i)=> (d >= 3*stdev(data))&&(i>0));
    return data.indexOf(peaks[0])+1;
}

function cfft(data)
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
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		let p = k/N;
		let t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		data[k] = even[k].add(t, odd[k]);
		data[k + hN] = even[k].sub(t, even[k]);
	}
	return data;
}