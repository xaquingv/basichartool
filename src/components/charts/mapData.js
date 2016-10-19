import {d3} from '../../lib/d3-lite'


//Sequential scales
const blue = ['#D4FFFF','#00699C','#49A7D1','#88CAE1','#3D95BC','#004971','#002A46','#000A1B'];
const red = ['#FFECCA','#FF513D','#FF9F84','#FFB89B','#FF856C','#F51911','#BC0003','#8A0003'];

//Diverging scales
const red_blue = ['#39A4D8','#ED3D61','#FFF8D1','#A1D2C9','#F59680','#058CCE','#6FBBC8','#DAEAC1','#FDD09E','#F58680','#CA2345'];
const orange_purple = ['#F4A35A','#91316B','#E9E9E9','#FDD09E','#C75C86','#FF7C42','#F5AB5B','#FFD5A9','#D593A5','#C4537F','#6D195A'];

//Colours order
const scale_seq = [ [0,1], [0,2,1], [0,3,4,1], [0,3,4,1,5], [0,3,4,1,5,6], [0,3,4,1,5,6,7] ];
const scale_div = [ [0,1], [0,2,1], [0,3,4,1], [0,3,2,4,1], [5,6,7,8,9,1], [5,6,7,2,8,9,10] ];

const counts = scale_seq.map(arr => arr.length)

const getColors = (count, scaleType, color) => {
  let iScale = counts.indexOf(count)
  let iColor = scaleType[iScale]
  let colors = iColor.map(i => color[i])
  return colors
}


export default function(data) {
  //console.log(data)
  // NOTE: at least 1 number required
  if (data.count.number===0) return null

  const dataCols = data.cols.map(d => d.values)
  const dataType = data.cols.map(d => d.type)

  /* values */
  //console.log(dataCols)
  let iNumber = dataType.indexOf("number")
  let colNumberClean = dataCols[iNumber].filter(val => !isNaN(val) && val)
  let domain = [
    Math.min(...colNumberClean),
    Math.max(...colNumberClean)
  ]
  //console.log(colNumber)
  //console.log(domain)
  let color = getColors(6, scale_seq, blue)
  let qtize = d3.scaleQuantize().domain(domain).range(color)
  let qtile = d3.scaleQuantile().domain(domain).range(color)

  /* countries */
  // country code or name mapping
  let key = []
  let iString = dataType.filter(type => type === "string").map((type, i) => i)
  iString.forEach(i => {
    let dataClean = dataCols[i].filter(val => val)
    let len = dataClean.length
    switch(true) {
      case (dataClean.filter(val => val.length === 3).length === len):
        key.push({type:"code", index:i, count:len})
        break
      case (dataClean.filter(val => val.length > 3).length === len):
        key.push({type:"name", index:i, count:len})
        break
      default:
        console.log("ni code ni name!", dataClean)
    }
  })
  // code first, name second
  key.sort((key1, key2) => key1.type - key2.type)


  /* mapping */
  // NOTE: no mapping means data is not for any world map charts
  if (key.length === 0) return null

  let dataMapping = {}
  dataCols[key[0].index].filter(key => key).forEach((key, i) => {
    dataMapping[key] = dataCols[iNumber][i]
  })
  //console.log(dataMapping)

  return {
    type: key[0].type,
    data: dataMapping,
    scaleColor: qtize,
    //color2: qtile,
    //color,
    domain
  }
}
