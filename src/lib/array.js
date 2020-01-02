export function uniqueArray(arr) {
  return arr.filter((d, i) => i === arr.indexOf(d))
}

export function swapArray(arr) {
  return arr[0].map((col, i) => arr.map(row => row[i]))
}

export function indexOfGreatestValueInArray(arr) {
  return arr.reduce((iMax, cur, iCur) => cur > arr[iMax] ? iCur : iMax , 0)
}

export function swapTwoValuesInArray(arr, idx1, idx2) {
  const newArr = [...arr]
  newArr[idx1] = arr[idx2]
  newArr[idx2] = arr[idx1]
  return newArr
}

// move the indexed (idx) value to the first
export function moveOneValueToTheFirstInArray(arr, idx) {
  const newArr = [...arr]
  const value1 = newArr.splice(idx, 1)
  return value1.concat(newArr)
}

// areTwoArraysHaveSameValues
// ...
