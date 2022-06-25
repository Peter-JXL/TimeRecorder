const moment = require( "moment")
let t1 = moment('2022-06-20 00:00','YYYY-MM-DD HH:mm')
let t2 = moment('2022-06-20 07:50','YYYY-MM-DD HH:mm')
console.log(t2.diff(t1, 'minutes', true))  //420.0083333333333


let dura = t2.format('x') - t1.format('x')
let timeSpan = moment.duration(dura)
console.log(timeSpan.days())     //0
console.log(timeSpan.hours())    //7
console.log(timeSpan.minutes())  //0

console.log(timeSpan.asMinutes()); //420.0083333333333

