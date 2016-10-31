export function uniqueArray(arr) {
  return arr.filter((d, i) => i === arr.indexOf(d))
}

export function swapeArray(arr) {
  return arr[0].map((col, i) =>
    arr.map(row => row[i])
  )
}
/*
let cols = rows[0].map(() => [] )
let rows.forEach((row, i) =>
  row.forEach((val, j) =>
    cols[j][i] = val
  )
)
*/
