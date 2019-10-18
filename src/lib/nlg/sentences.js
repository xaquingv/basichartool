import { NaturalLanguage } from './src/main';

export default function (data, type="sentence") {

    data.dataType = 'scatterPlot';
    data.sentenceType = 'scatterPlot';

    let NL = new NaturalLanguage([data]);
    NL.addType("scatterPlot", scatterPlotType);
    NL.addSentence("scatterPlot", scatterPlotSentence);

    if (type === 'sentence') return NL.generate(-1, true);
    else if (type === 'questions') return NL.getQuestions(-1);

}


// function addDataType(data) {
//     data.dataType = 'scatterPlot';
//     data.sentenceType = 'scatterPlot';

//     let NL = new NaturalLanguage([data]);
//     NL.addType("scatterPlot", scatterPlotType);
//     NL.addSentence("scatterPlot", scatterPlotSentence);

//     return NL;
// }

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
        if (typeof data.difference !== "undefined" && data.difference !== "na") {
            result.difference = Number.isInteger(data.difference) ? Math.abs(data.difference): Math.abs(data.difference).toFixed(data.precision);
        }
        return result;
    },

    getDifference(data) {
        if (typeof data.compareValue !== "undefined") {
            return data.compareValue - data.value;
        } else {
            return "na";
        }
    }
};

const scatterPlotSentence = {
    simpleSentences: {
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
            "Between {id} there has been an increase of {difference} {units}"
        ],
        "negative": [
            "Between {id} there has been a decrease of {difference} {units}"
        ],
        "neutral": [
            "This reveals very little"
        ]
    },
    simpleQuestions: {
        "na": {
            "mean": [
                "What makes {id}’s {value} {units} representative?",
                "How does it compare to {type} of similar characteristics?"
            ],
            "median": [
                "Why is {id}’s {value} {units} a good example of the?",
                "Does it compare to {type} of similar characteristics?"
            ],
            "mode": [
                "The most frequent value is {value}. Is {id} a good example of what’s the norm?",
                "Are there other {type} in the data that"
            ],
            "percentile98": [
                "What’s that connection between {id}?",
                "Why do they all have such a high {column}?",
                "Any of them out of place? Has anything happened recently to rank it in the top?"
            ],
            "percentile2": [
                "What do {id} have in common?",
                "What is the reason they all have such a low {column}?",
                "If any of them is an exception, has anything happened recently to send it to the bottom?"
            ],
            "max": [
                "What’s the reason {id} shows the highest {column}?",
                "If this is unusual (or historically hasn’t been like this), what has happened recently to rank it in the top?"
            ],
            "min": [
                "Why does {id} have the lowest {column}?",
                "Has there been a recent change? What has happened to rank it in the top?"
            ],
            "default": [

            ]
        },
        "positive": [

        ],
        "negative": [

        ],
        "neutral": [

        ]
    },
    getSimpleSentenceList(data, simpleSentences) {
        //console.log(data.stat)
        if (data.difference === "na") {
            if (typeof data.stat !== "undefined") {
                return this.simpleSentences[data.levelType][data.stat];
            } else {
                return this.simpleSentences[data.levelType]["default"];
            }
        } else {
            return this.simpleSentences[data.levelType];
        }
    },
    getSimpleQuestionList(data, simpleQuestion) {
        if (data.difference === "na") {
            if (typeof data.stat !== "undefined") {
                return this.simpleQuestions[data.levelType][data.stat];
            } else {
                return this.simpleQuestions[data.levelType]["default"];
            }
        } else {
            return this.simpleQuestions[data.levelType];
        }
    }
};