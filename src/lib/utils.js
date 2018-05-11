export function isHex(color) {
  const regexHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i
  return regexHex.test(color)
}

export function rgbToHex(rgbString) {
  const numToHex = (num) => {
    const hex = num.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  if (isHex(rgbString)) {
    return rgbString
  } else {

    const rgb = rgbString.slice(4, -1).split(",")
    const hex = rgb.map(str => numToHex(parseInt(str, 10))).join("")
    //console.log(rgb, hex)

    return "#" + hex
  }
}
