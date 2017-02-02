
/* number apply format*/
export function numToTxt(num) {
    // filter
    let txt = num.toString();
    if (txt[txt.length-1] !== "0") {
      return num.toLocaleString();//numFormat(num);
    }

    let abs = Math.abs(num),
        pow = Math.floor(Math.log10(abs)),
        div = (d) => Math.pow(10, d),
        sign = Math.sign(num) === -1 ? "-" : ""; // negative num

    switch (true) {
        case pow >= 12: txt = abs/div(12)    + "tn"; break;
        case pow >=  9: txt = abs/div(9)     + "bn"; break;
        case pow >=  6: txt = abs/div(6)     + "m";  break;
        //case pow >=  5: txt = abs*100/div(5) + "k";  break;
        default: txt = abs//numFormat(abs);
    }
    return sign + txt.toLocaleString();//txt;
}

// to local string
/*function numFormat(num) {
    let str = num.toString().split("."), // float num
        txt = str[0], // num without negative and float
        dec = str[1] ? "." + str[1] : "",
        len = txt.length;

    return len > 3 ?
        //txt.substring(0, len-3) + "," + txt.substring(len-3) + dec :
        txt.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + dec :
        txt + dec;
}*/
