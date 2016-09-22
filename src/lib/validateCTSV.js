export default function(data) {
    console.log(data);

    let dataMatch = data.match(/\t/g);
    let dataType = dataMatch ? "tsv" : "csv";
    let dataLines = data.split(/[\n|\r]/g);
    
    console.log(dataType, dataMatch.length, dataLines.length);
    console.log(dataLines);
}
