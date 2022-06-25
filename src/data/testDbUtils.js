const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});
const moment = require( "moment")


//返回labelTable的所有值
function returnLabelTableData() {
    knex.from('labelTable').select("*").then((rows) => {
        rows.forEach(row => {
            console.log(`${row['ID']} ${row['firstLabel']} ${row['secondLabel']} ${row['timeNote']}`);
        });
    }).catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
}

//返回某一天的所有数据，输入参数为日期
function returnOneDayData(recordDate) {
    var data;
    knex.from('dataTable').
    select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
    where('recordDate', 'like', `%${recordDate}%`)
        .then((rows) => {
            data = rows
            rows.forEach(row => {
                console.log(`${row['ID']} ${row['recordDate']}  ${row['beginTime']} ${row['endTime']}  ${row['firstLabel']} ${row['secondLabel']}  ${row['timeNote']}`);
            });
        })
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
    return data
}

//插入一条时间记录
function insertTime(oneTime){
    knex('dataTable')
    .insert(oneTime).then(()=>{
        console.log('insert Success');
    })
    .catch((err)=>{
        console.log(err);
        throw err
    }).finally(()=>{
        knex.destroy()
    })
    
}

//插入一条标签
function insertLabel(label){
    knex('labelTable')
    .insert(label).then(()=>{
        console.log('insert Label Table Success');
    })
    .catch((err)=>{
        console.log(err);
        throw err
    }).finally(()=>{
        knex.destroy()
    })
}


//更新一条时间记录
function updateOneTime({ID,recordDate, beginTime, endTime, firstLabel, secondLabel, timeNote}){
    knex('dataTable')
    .where('ID', '=', ID)
    .update({
        recordDate,
        beginTime,
        endTime,
        firstLabel,
        secondLabel,
        timeNote
    }).then(()=>{
        console.log('update Time Table Success');
    })
    .catch((err)=>{
        console.log(err);
        throw err
    }).finally(()=>{
        knex.destroy()
    })


}

// 删除一条时间记录
function deleteOneTime(ID){
    knex('dataTable').where('ID',ID).del().then(()=>{
        console.log('delete成功');
    }).catch((err)=>{
        console.log(err);
    }).finally(()=>{
        knex.destroy()
    })
}


//更新一条标签
function updateLabel(oneTime){
    console.log(oneTime);

}

//统计一段时间的数据，标签和备注是可选项
function statTime(recordDate, beginDate, endDate, firstLabel='all', secondLabel='all', timeNote='all'){

}

//统计一天当中每个标签所花的时间，其中未记录的作为单独一个标签
function statOneDayTime(recordDate){
    
    var oneDayMinutes = 24 * 60 //一天有多少分钟
    var recordDateMinutes = 0
    var labelTimeMap = new Map()
    knex.from('dataTable').
    select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
    where('recordDate', 'like', `%${recordDate}%`)
        .then((rows) => {
            console.log('length' + rows.length);
            rows.forEach(row => {
                var firstLabel = row['firstLabel']
                var beginTime = moment(row['beginTime'], 'YYYY-MM-DD HH:MM')
                var endTime = moment(row['endTime'], 'YYYY-MM-DD HH:MM')
                var timeSpan = endTime.diff(beginTime, 'minute', true)
                // console.log(beginTime.format('YYYY-MM-DD HH:SS'), endTime.format('YYYY-MM-DD HH:SS'), timeSpan);
                if(labelTimeMap.has(firstLabel)){
                    labelTimeMap.set(firstLabel, labelTimeMap.get(firstLabel)+timeSpan)
                }else{
                    labelTimeMap.set(firstLabel, timeSpan)
                }
                recordDateMinutes +=timeSpan

                // console.log(`${row['ID']} ${row['recordDate']}  ${row['beginTime']} ${row['endTime']}  ${row['firstLabel']} ${row['secondLabel']}  ${row['timeNote']}`);
            });
            console.log(recordDateMinutes);
            console.log('未记录的时间：',oneDayMinutes - recordDateMinutes);
            for (var key in mapTest){
                console.log('???');
                console.log("属性" + key, "值" + mapTest[key]);
            }
        })
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
   
    return labelTimeMap
    
}

//returnLabelTableData()
//returnOneDayData()

const oneTime = {
    recordDate: '20220623',
    beginTime: '2022-06-23 00:00',
    endTime: '2022-06-23 7:50',
    firstLabel: '睡眠',
    secondLabel: '睡眠',
    timeNote: '睡眠'
}
// insertTime(oneTime)
const label = {
    firstLabel: '睡眠',
    secondLabel: '睡眠',
    timeNote:'睡眠fuck'
}
// insertLabel(label)

const updateTime = {
    ID: '28517',
    recordDate: '20220623',
    beginTime: '2022-06-23 00:00',
    endTime: '2022-06-23 7:50',
    firstLabel: '睡眠',
    secondLabel: '睡眠',
    timeNote: '午睡啊啊啊'
}




// updateOneTime(updateTime)

const mapTest = statOneDayTime('2022-06-20')


