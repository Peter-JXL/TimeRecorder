const moment = require( "moment")
let t1 = moment('2022-06-25 00:00','YYYY-MM-DD HH:SS')
let t2 = moment('2022-06-25 07:50','YYYY-MM-DD HH:SS')
// let dura = t2.format('x') - t1.format('x')
// let temTime = this.moment.duration(dura)

// console.log(temTime.days())
// console.log(temTime.hours())
// console.log(temTime.minutes())

console.log(t2.diff(t1, 'minute'))
console.log(typeof (t2.diff(t1, 'minute')))