// meta keys
const META_KEYS = ["headline", "standfirst", "source", "type", "keys"];

export default function(data) {
    // console.log(data);

    // type
    let dataMatch = {
      open:  data.match(/{/g),
      close: data.match(/}/g),
      tab:   data.match(/\t/g),
      comma: data.match(/\t/g),
    };
    let dataType = dataMatch.tab ? "tsv" : "csv";
    // and json?
    // console.log(dataType);

    // lines
    let dataLines = data.split(/[\n|\r]/g);
    // console.log(dataLines);

    // parse to meta and row data
    let dataInput = { meta:{}, rows:[] };
    dataLines.forEach(row => {
        switch(dataType) {
            case "tsv": row = row.split("\t"); break;
            case "csv": row = row.split(",");  break;
            case "json": console.log("add a parser"); break;
            default: console.log("need a new type:", dataType);
        }
        parseRow(dataInput, row);
    });
    // console.log(dataInput);

    return dataInput;
}

// Check if a row is meta data
function isMetaKeys(col) {
    return META_KEYS.filter(d => d === col).length === 1;
}

// Check if a row is empty, all cols have no value as content
function isNotEmpty(row) {
    return row.length !== row.filter(d => d === null).length;
}

function parseRow(dataInput, row) {
    let col0 = row[0].toLowerCase();
    // col0 is the key if this row is meta data

    // 1. trim and set empty entris to null
    row = row.map(d => {
        d = d.trim();
        return d!=="" ? d : null;
    });

    // 2. extract meta
    // 3. ignore empty lines
    switch (true) {
        case isMetaKeys(col0): dataInput.meta[col0] = row[1]; break;
        case isNotEmpty(row): dataInput.rows.push(row); break;
        default: /*console.log("empty row")*/;
    }
}
