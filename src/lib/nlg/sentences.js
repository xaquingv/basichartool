//import assert from 'assert'
import { NaturalLanguage } from '../nlg/src/main';

export default function (data) {

    data.dataType = 'scatterPlot', data.sentenceType = 'scatterPlot';

    let NL = new NaturalLanguage([data]);
    NL.addType("scatterPlot", scatterPlotType);
    NL.addSentence("scatterPlot", scatterPlotSentence);
    return NL.generate(-1, true);
}

const scatterPlotType = {
    getDisplayInfo(data) {
        const result = {};
        result.column = data.column.toLowerCase();
        result.value = data.value;
        if (typeof data.type !== "undefined") {
            result.type = data.type.toLowerCase();
        }
        if (typeof data.id !== "undefined") {
            result.id = data.id.toLowerCase();
        }
        if (typeof data.units !== "undefined") {
            result.units = data.units.toLowerCase();
        }
        if (typeof data.compareValue !== "undefined") {
            result.compareValue = data.compareValue;
        }
        if (typeof data.statDefinition !== "undefined") {
            result.statDefinition = data.statDefinition;
        }
        return result;
    },

    getDifference(data) {
        if (typeof data.compareValue !== "undefined") {
            return parseInt(data.compareValue) - parseInt(data.value);
        } else {
            return "na";
        }
    }
};

const scatterPlotSentence = {
    simpleSentencese: {
        "na": {
            "mean": [
                "The {statDefinition} {column} for these {type} is {id}: {value} {units}",
                "{id} has the {statDefinition} {column} at {value} {units}",
                "{column} for {id} is {value} {units}, which is the {statDefinition} for these {type}"
            ],
            "median": [
                "The {statDefinition} {column} for these {type} is {id}: {value} {units}",
                "{id} has the {statDefinition} {column} at {value} {units}",
                "{column} for {id} is {value} {units}, which is the {statDefinition} for these {type}"
            ],
            "mode": [
                "The {statDefinition} {column} for these {type} is {id}: {value} {units}",
                "{id} has the {statDefinition} {column} at {value} {units}",
                "{column} for {id} is {value} {units}, which is the {statDefinition} for these {type}"
            ],
            "percentile98": [
                "{id} have the {statDefinition} {column} at over {value} {units}",
                "At over {value} {units}, {id} have the {statDefinition} {column} ",
                "{id} rank at the top in {column} with over {value} {units}"
            ],
            "percentile2": [
                "{id} have the {statDefinition} {column} at below {value} {units}",
                "Below {value} {units}, {id} have the {statDefinition} {column} ",
                "{id} rank at the bottom in {column} — below {value} {units}"
            ],
            "max": [
                "At the top, {id}’s {column} is at {value} {units}",
                "The {statDefinition} {column} is {id}’s at {value} {units}",
                "{id} has the {statDefinition} {column}: {value} {units}",
                "{id}’s {column} is the {statDefinition} at {value} {units}",
                "{id} ranks at the top in {column} at {value} {units}"
            ],
            "min": [
                "At the bottom of the ranking, {id}’s {column} at {value} {units}",
                "The {statDefinition} {column} is {id}’s at {value} {units}",
                "{id} has the {statDefinition} {column}: {value} {units}",
                "{id}’s {column} is the {statDefinition} at {value} {units}",
                "{id} ranks at the bottom in {column} at {value} {units}"
            ],
            "default": [
                "{id} is {value}"
            ]
        },
        "positive": [
            "compareValue is bigger than value"
        ],
        "negative": [
            "value is bigger than compareValue"
        ],
        "neutral": [
            "Neutral is not defined!!!!!"
        ]
    },

    getSimpleSentenceList(data, simpleSentencese) {
        //console.log(data.stat)
        if (data.difference === "na") {
            if (typeof data.stat !== "undefined") {
                return this.simpleSentencese[data.levelType][data.stat];
            } else {
                return this.simpleSentencese[data.levelType]["default"];
            }
        } else {
            return this.simpleSentencese[data.levelType];
        }
    }
};