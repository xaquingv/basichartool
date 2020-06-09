/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/**
 * Natural Language base class
 * ------------------------------------------------------------
 * @name NaturalLanguage
 * 
 * @constructor
 * @param {Array} data - a list of inputs
*/
let NaturalLanguage;
exports.NaturalLanguage =
  (NaturalLanguage = (function () {
    let global = undefined;
    let _ = undefined;
    let config = undefined;
    let sentences = undefined;
    let capitalize = undefined;
    let replaceStr = undefined;
    let replaceQuestion = undefined;
    let replaceCombinedStr = undefined;
    let setAttrs = undefined;
    let getDifference = undefined;
    let getDisplayInfo = undefined;
    let calculatePriority = undefined;
    let calculateLevel = undefined;
    let calculateType = undefined;
    let selectData = undefined;
    let groupData = undefined;
    let getSimpleSentenceList = undefined;
    let getSimpleQuestionList = undefined;
    let buildSimpleSentence = undefined;
    let buildSimpleQuestion = undefined;
    let addSimpleSentence = undefined;
    let getCompoundSentenceList = undefined;
    let buildCompoundSentence = undefined;
    let buildSentences = undefined;
    let buildQuestions = undefined;
    NaturalLanguage = class NaturalLanguage {
      static initClass() {

        /**
         * ------------------------------------------------------------
         * Prepare resource
         * ------------------------------------------------------------
        */
        global = null;
        _ = require("underscore");
        config = require("./resources/config.json");
        sentences = require("./resources/sentences.json");

        /**
         * ------------------------------------------------------------
         * HELPER FUNCTION
         * ------------------------------------------------------------
        */


        /**
         * Change the first character of the string to capital
         * ------------------------------------------------------------
         * @name capitalize
         * @param  {string} data
         * @return {string} capitalized string
        */

        capitalize = data => data.charAt(0).toUpperCase() + data.slice(1);


        /**
         * Replace sentence pattern with string in data object
         * (single sentence, no capitalization or full stop)
         * ------------------------------------------------------------
         * @name replaceStr
         * @param  {array}  patterns - array of sentences
         * @param  {object} data - displayInfo object
         * @return {string} final sentence
        */

        replaceStr = function (patterns, data) {
          let pattern;
          if (global.random) {
            pattern = _.sample(patterns);
          } else {
            pattern = patterns[0];
          }
          _.each(data, (item, key) => pattern = pattern.replace(`{${key}}`, item));
          return pattern;
        };

        replaceQuestion = function (patterns, data) {
          let pattern;
          const result = [];
          for (let i in patterns) {
            pattern = patterns[i];
            _.each(data, (item, key) => pattern = pattern.replace(`{${key}}`, item));
            // console.log(pattern[i])
            // console.log(pattern)
            result.push(pattern);
          }
          return result;
        };


        /**
         * Replace sentence pattern with string in data object
         * (combined sentence, with capitalization and full stop)
         * ------------------------------------------------------------
         * @name replaceCombinedStr
         * @param  {array}  patterns - array of sentences
         * @param  {array}  data - array of displayInfo object
         * @return {string} final sentence
        */

        replaceCombinedStr = function (patterns, data) {
          let pattern;
          if (global.random) {
            pattern = _.sample(patterns);
          } else {
            pattern = patterns[0];
          }
          _.each(data, (items, i) =>
            _.each(items, (item, key) => pattern = pattern.replace(`{${key}.${i}}`, items[key]))
          );
          return pattern;
        };


        /**
         * ------------------------------------------------------------
         * METHOD LIST
         * ------------------------------------------------------------
        */


        /**
         * Add more required attributes
         * ------------------------------------------------------------
         * @name setAttrs
         * @param  {array}  data - array of inputs
         * @return {Object} new data with more attributes
         * @private
        */

        setAttrs = function (data) {
          _.each(data, function (item, i) {
            if (item.options !== undefined) {
              // item.options = _.extend _.clone(config.default), item.options
              item.options = _.defaults(item.options, config.default);
            } else {
              item.options = {
                "priority": {
                  "init": 1,
                  "negativeFactor": 20,
                  "positiveFactor": 100
                },
                "level": {
                  "threshold": 0.00,
                  "sensitiveness": 1
                }
              };
            }
            if (!item.dataType) { item.dataType = "default"; }
            //console.log(item.dataType)
            // Custom for more attributes
            if (global.dataConfig[item.dataType] && global.dataConfig[item.dataType].setAttrs) {
              item = global.dataConfig[item.dataType].setAttrs(item);
            }

            // Default attributes
            if (typeof item.alwaysShow === "undefined") { item.alwaysShow = false; }
            if (!item.contentGroup) { item.contentGroup = "default"; }
            if (!item.sentenceType) { item.sentenceType = "default"; }
            if (typeof item.precision === "undefined") { item.precision = 2; }
            item.difference = getDifference(item);
            item.displayInfo = getDisplayInfo(item);
            item.priority = calculatePriority(item);
            item.level = calculateLevel(item);
            return item.levelType = calculateType(item.level);
          });

          return data;
        };


        /**
         * Get the difference between old value and current value
         * ------------------------------------------------------------
         * @name getDifference
         * @param  {object}        data
         * @return {number/string} difference value or 'na' if there is no compareValue
         * @private
        */

        getDifference = function (data) {
          // Override
          if (global.dataConfig[data.dataType] && global.dataConfig[data.dataType].getDifference) {
            return global.dataConfig[data.dataType].getDifference(data);
          }

          // Default
          if ((typeof data.compareValue !== "undefined") && (typeof data.compareValue === "number")) {
            return data.value - data.compareValue;
          } else {
            return "na";
          }
        };


        /**
         * Prepare strings required to show in the sentence
         * ------------------------------------------------------------
         * @name getDisplayInfo
         * @param  {object} data
         * @return {object} information required to display in the sentence
         * @private
        */

        getDisplayInfo = function (data) {
          // Override
          if (global.dataConfig[data.dataType] && global.dataConfig[data.dataType].getDisplayInfo) {
            return global.dataConfig[data.dataType].getDisplayInfo(data);
          }

          // Default
          const result = {};
          result.column = data.column.toLowerCase();

          if (typeof data.compareValue !== "undefined") {
            if (typeof data.compareValue === "number") {
              result.compareValue = data.compareValue.toFixed(data.precision);
            } else {
              result.compareValue = data.compareValue.toLowerCase();
            }
            if (typeof data.difference === "number") {
              result.difference = Math.abs(data.difference).toFixed(data.precision);
            }
          }
          if (typeof data.value === "number") {
            result.value = data.value.toFixed(data.precision);
          } else {
            result.value = data.value.toLowerCase();
          }

          return result;
        };


        /**
         * Calculate the priority of change
         * ------------------------------------------------------------
         * @name calculatePriority
         * @param  {object} data
         * @return {number} new priority
         * @private
        */

        calculatePriority = function (data) {
          // Override
          let newPriority;
          if (global.dataConfig[data.dataType] && global.dataConfig[data.dataType].calculatePriority) {
            return global.dataConfig[data.dataType].calculatePriority(data);
          }

          // Default
          const priorityConfig = data.options.priority;

          if (data.difference === "na") {
            return priorityConfig.init;
          } else if (data.difference > 0) {
            newPriority = priorityConfig.init +
              (priorityConfig.positiveFactor * data.difference);
          } else {
            newPriority = priorityConfig.init +
              (priorityConfig.negativeFactor * Math.abs(data.difference));
          }

          return parseInt(newPriority.toFixed(0), 10);
        };


        /**
         * Calculate the intesity of change
         * ------------------------------------------------------------
         * @name calculateLevel
         * @param  {object} data
         * @return {number} intensity of the change
         * @private
        */

        calculateLevel = function (data) {
          // Override
          let level;
          if (global.dataConfig[data.dataType] && global.dataConfig[data.dataType].calculateLevel) {
            return global.dataConfig[data.dataType]
              .calculateLevel(data.difference, data.options.level);
          }

          // Default
          const levelConfig = data.options.level;

          if (data.difference === "na") {
            level = "na";
          } else {
            const absoluteDifference = Math.abs(data.difference);
            if (absoluteDifference < levelConfig.threshold) {
              level = 0;
            } else {
              level = /*Math.ceil(*/data.difference / levelConfig.sensitiveness/*)*/;
              if (level > 3) { level = 3; }
              if (level < -3) { level = -3; }
            }
          }
          return level;
        };


        /**
         * Calculate the type of intesity
         * ------------------------------------------------------------
         * @name calculateType
         * @param  {number} level
         * @return {string} levelType
         * @private
        */

        calculateType = function (level) {
          if (level > 0) {
            return "positive";
          } else if (level < 0) {
            return "negative";
          } else if (level === "na") {
            return "na";
          } else {
            return "neutral";
          }
        };


        /**
         * Select number of data to display and sort by priority
         * ------------------------------------------------------------
         * @name selectData
         * @param  {array}  data - array of data split into two groups: alwaysShow and sortedData
         * @param  {number} nData - number of data to show
         * @return {array}  selected, sorted data by priority
         * @private
        */

        selectData = function (data, nData) {
          const groupedData = groupData(data);
          let result = groupedData.alwaysShow;
          if (nData === -1) {
            return result.concat(groupedData.sortedData);
          }
          if (result.length < nData) {
            const nRemaining = nData - result.length;
            result = result.concat(groupedData.sortedData.slice(0, nRemaining));
          }
          result.sort((a, b) => b.priority - a.priority);

          return result;
        };


        /**
         * Group data by alwaysShow attr and sort the group by priority
         * ------------------------------------------------------------
         * @name groupData
         * @param  {array} data - array of data
         * @return {array} data split into two groups, alwaysShow and sortedData
         * @private
        */

        groupData = function (data) {
          // Remove hidden items
          data = _.filter(data, item => !item.hidden);

          data = _.groupBy(data, "alwaysShow");
          data.sortedData = [];
          data.alwaysShow = [];

          if (data[false]) {
            data[false].sort((a, b) => b.priority - a.priority);
            data.sortedData = data[false];
          }
          if (data[true]) { data.alwaysShow = data[true]; }

          return data;
        };


        /**
         * Get a valid list of sentences for random selecting
         * ------------------------------------------------------------
         * @name getSimpleSentenceList
         * @param  {object} data - data object
         * @param  {array}  simpleSentences - sentences from all types
         * @return {array}  array of valid sentences
         * @private
        */

        getSimpleSentenceList = function (data, simpleSentences) {

          //console.log(data);
          //console.log(simpleSentences);
          // Override
          if (global.sentenceConfig[data.sentenceType]
            && global.sentenceConfig[data.sentenceType].getSimpleSentenceList) {
            return global.sentenceConfig[data.sentenceType]
              .getSimpleSentenceList(data, simpleSentences);
          }

          // Default
          if (typeof data.compareValue === "undefined") { // No compareValue
            if ((typeof sentences.simpleSentences[data.sentenceType] !== "undefined")
              && (typeof sentences.simpleSentences[data.sentenceType]["na"] !== "undefined")) {
              return sentences.simpleSentences[data.sentenceType]["na"];
            } else {
              return sentences.simpleSentences["default"]["na"];
            }
          } else {
            if ((typeof sentences.simpleSentences[data.sentenceType] !== "undefined")
              && (typeof sentences.simpleSentences[data.sentenceType][data.levelType] !== "undefined")) {
              if (typeof sentences.simpleSentences[data.sentenceType][data.levelType][data.level.toString()] !== "undefined") {
                return sentences.simpleSentences[data.sentenceType][data.levelType][data.level.toString()];
              } else {
                return sentences.simpleSentences[data.sentenceType][data.levelType];
              }
            } else {
              return sentences.simpleSentences["default"][data.levelType][data.level.toString()];
            }
          }
        };

        getSimpleQuestionList = function (data, simpleQuestion) {
          // Override
          if (global.sentenceConfig[data.sentenceType]
            && global.sentenceConfig[data.sentenceType].getSimpleQuestionList) {
            return global.sentenceConfig[data.sentenceType]
              .getSimpleQuestionList(data, simpleQuestion);
          }

          // Default
          if (typeof data.compareValue === "undefined") { // No compareValue
            if ((typeof sentences.simpleQuestions[data.sentenceType] !== "undefined")
              && (typeof sentences.simpleQuestions[data.sentenceType]["na"] !== "undefined")) {
              return sentences.simpleQuestions[data.sentenceType]["na"];
            } else {
              return sentences.simpleQuestions["default"]["na"];
            }
          } else {
            if ((typeof sentences.simpleQuestions[data.sentenceType] !== "undefined")
              && (typeof sentences.simpleQuestions[data.sentenceType][data.levelType] !== "undefined")) {
              if (typeof sentences.simpleQuestions[data.sentenceType][data.levelType][data.level.toString()] !== "undefined") {
                return sentences.simpleQuestions[data.sentenceType][data.levelType][data.level.toString()];
              } else {
                return sentences.simpleQuestions[data.sentenceType][data.levelType];
              }
            } else {
              return sentences.simpleQuestions["default"][data.levelType][data.level.toString()];
            }
          }
        };


        /**
         * Group data into contentGroups and loop through each
         * contentGroup to create sentence(s)
         * ------------------------------------------------------------
         * @name buildSimpleSentence
         * @param  {object} data - data object
         * @return {array}  array of sentences
         * @private
        */

        buildSimpleSentence = function (data) {
          const simpleSentences = getSimpleSentenceList(data, sentences.simpleSentences);
          //console.log(simpleSentences)
          return replaceStr(simpleSentences, data.displayInfo);
        };
        //console.log(simpleSentences)

        buildSimpleQuestion = function (data) {
          const simpleQuestions = getSimpleQuestionList(data, sentences.simpleQuestions);
          return replaceQuestion(simpleQuestions, data.displayInfo);
        };


        /**
         * Add simple sentence into the data object
         * ------------------------------------------------------------
         * @name addSimpleSentence
         * @param  {array} array of data to generate simple sentences
         * @return {array} array of data with sentence attribute inserted
         * @private
        */

        addSimpleSentence = function (data) {
          for (let i in data) {
            data[i].displayInfo.sentence = buildSimpleSentence(data[i]);
          }
          //if(typeof data[i].subType != "undefined" && data[i].subType == "minMax")
          //{
          //valueAux = data[i].value
          //data[i].value = data[i].value2;
          //data[i].value2 = valueAux;
          //data[i].difference   = getDifference data[i]
          //data[i].level        = calculateLevel data[i]
          //data[i].levelType    = calculateType data[i].level

          //}
          //console.log(data[i].displayInfo.sentence) 
          return data;
        };

        /**
        * Get a valid list of compound sentences
        * ------------------------------------------------------------
        * @name getCompoundSentenceList
        * @param  {object} data - data object
        * @param  {array}  compoundSentences - sentences from all types
        * @return {array}  array of valid sentences
        * @private
        */

        getCompoundSentenceList = function (data, compoundSentences) {
          // Override
          if (global.sentenceConfig[data.sentenceType] && global.sentenceConfig[data.sentenceType].getCompoundSentenceList) {
            return global.sentenceConfig[data.sentenceType].getCompoundSentenceList(data, compoundSentences);
          }
          // Default
          if (sentences.compoundSentences[data.sentenceType] !== undefined) {
            return compoundSentences[data[0].sentenceType];
          } else {
            return compoundSentences.default;
          }
        };

        /**
         * Combine two simple sentencese that are in the same sentenceGroup
         * ------------------------------------------------------------
         * @name buildCompoundSentence
         * @param  {array}  array of one or two data objects to combine
         * @return {string} a combine sentence
         * @private
        */

        buildCompoundSentence = function (data) {
          const types = _.pluck(data, "levelType");
          const type = types.join("_");
          //console.log(type)
          const moreDisplayInfo = _.pluck(addSimpleSentence(data), "displayInfo");
          const compoundSentences = getCompoundSentenceList(data, sentences.compoundSentences);
          //console.log(moreDisplayInfo)
          const selectedSentences = _.find(compoundSentences, group => _.contains(group.type, type));
          //console.log(selectedSentences)
          return capitalize(replaceCombinedStr(selectedSentences.sentences, moreDisplayInfo));
        };


        /**
         * Group data into contentGroups and loop through each
         * contentGroup to create sentence(s)
         * ------------------------------------------------------------
         * @name buildSentences
         * @param  {array} data - array sorted by priority but not grouped
         * @return {array} array of sentences
         * @private
        */

        buildSentences = function (data) {
          const result = [];
          data = _.groupBy(data, "contentGroup");

          // for group of data
          _.each(data, function (group) {
            if (group.length > 2) {
              let i = 0;
              return (() => {
                const result1 = [];
                while (i < group.length) {
                  if ((i + 1) === group.length) {
                    result.push(buildCompoundSentence([group[i]]));
                  } else {
                    result.push(buildCompoundSentence([group[i], group[parseInt(i) + 1]]));
                  }
                  result1.push(i = i + 2);
                }
                return result1;
              })();
            } else {
              return result.push(buildCompoundSentence(group));
            }
          });

          return result;
        };

        buildQuestions = function (data) {
          const result = [];
          for (let i in data) {
            result.push(buildSimpleQuestion(data[i]));
          }
          return result;
        };
      }

      constructor(data) {
        this.data = data;
        this.dataConfig = {};
        this.sentenceConfig = {};
        this.random = true;
        global = this;
      }

      addType(column, func) {
        //console.log(@dataConfig[column])
        if (func == null) { func = {}; }
        if (this.dataConfig[column]) {
          return this.dataConfig[column] = _.extend(this.dataConfig[column], func);
        } else {
          return this.dataConfig[column] = func;
        }
      }
      addSentence(column, func = null) {
        if (this.sentenceConfig[column]) {
          return this.sentenceConfig[column] = _.extend(this.sentenceConfig[column], func);
        } else {
          return this.sentenceConfig[column] = func;
        }
      }

      /**
       * Generate sentences from a list of data
       * ------------------------------------------------------------
       * @name NaturalLanguage.generate
       * @param {number} nData - number of sentences to generate
       * @return {String/Number/Object/Function/Boolean} desc
       * @public
      */
      generate(nData, random) {
        if (nData == null) { nData = -1; }
        if (random == null) { random = true; }
        this.random = random;
        let data = setAttrs(this.data);
        data = selectData(data, nData);
        const result = buildSentences(data);
        // return data
        // for i of data
        //   console.log data[i].column, ": ", data[i].priority
        return result.join(" ");
      }

      getQuestions(nData) {
        if (nData == null) { nData = -1; }
        let data = setAttrs(this.data);
        data = selectData(data, nData);
        const result = buildQuestions(data);
        return result[0];
      }

      debug(nData, random) {
        // let result;
        if (nData == null) { nData = -1; }
        if (random == null) { random = true; }
        this.random = random;
        return setAttrs(this.data);
        // let data = setAttrs(this.data);
        // data = selectData(data, nData);
        // return result = buildSentences(data);
      }
    };
    NaturalLanguage.initClass();
    return NaturalLanguage;
  })());

// signType = {
//   words: {
//     "Debt Level": {
//       "-": "0",
//       "Low .*": "+1",
//       "No .*": "+2",
//       "High .* in the past 5 years": "-1",
//       "High .*": "-2",
//       "Very High .*": "-3"
//     },
//     "Share Repurchase": {
//       "-": "0",
//       "Every year": "+2"
//     },
//     "CapEx": {
//       "-": "0",
//       "Very Low": "+2",
//       "Very High": "-2"
//     }
//   },
//   setAttrs: (data) ->
//     data.newScore = @getScore(data.column, data.value)
//     if(typeof data.compareValue != "undefined")
//       data.oldScore = @getScore(data.column, data.compareValue)
//     if(data.newScore == '0')
//       data.hidden = true
//     data

//   getDisplayInfo: (data) ->
//     precision = data.precision
//     result = {}
//     result.column = data.column.toLowerCase()
//     result.column = "CapEx" if data.column == "CapEx"
//     result.value = data.value.toLowerCase()
//     if(typeof data.compareValue != "undefined")
//       result.compareValue = data.compareValue.toLowerCase()
//     result

//   getScore: (column, data) ->
//     for item of @words[column]
//       pattern = new RegExp(item, "g");
//       if pattern.test(data)
//         return @words[column][item]
//     return null

//   getDifference: (data) ->
//     if(typeof data.compareValue != "undefined")
//       parseInt(data.newScore) - parseInt(data.oldScore)
//     else
//       "na"  
// }
// # String with custom functions


// NL = new NaturalLanguage [{
//   "column": "Share Repurchase",
//   "compareValue": "-",
//   "value": "Every year",
//   "dataType": "sign"
// }]
// NL.addType "sign", signType
// # String with custom functions + compareValue
// console.log NL.generate(-1, false)

  // adef = {
  //   'key1': 'value1',
  //   'key2': 'value2'
  // }
  // aover ={
  //   'key1': 'value1override',
  //   'key3': 'value3'
  // }
  // console.log _.extend(adef, aover)
  // console.log adef
  // console.log aover