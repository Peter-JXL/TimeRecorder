const moment = require( "moment")
let t1 = moment('2022-06-20 00:00','YYYY-MM-DD HH:mm')
let t2 = moment('2022-06-20 07:50','YYYY-MM-DD HH:mm')
console.log(t2.diff(t1, 'minutes', true))  

let dura = t2.format('x') - t1.format('x')
let timeSpan = moment.duration(dura)
console.log(timeSpan.days())     
console.log(timeSpan.hours())   
console.log(timeSpan.minutes()) 

console.log(timeSpan.asMinutes()); 

let s = t1.format('YYYY-MM-DD ').toString()
console.log(s);