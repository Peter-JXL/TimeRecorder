const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});
const moment = require("moment")
var body;

async function getLabelTableData(){
    body = await returnLabelTableData();
    console.log(body);
}

//返回labelTable的所有值
function returnLabelTableData() {
    return knex.from('labelTable').select("firstLabel").groupBy('firstLabel')
}


//返回labelTable的所有值
function returnLabelTableData_test() {
    var data
    knex.select("*").from('labelTable').then((rows) => {
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
function insertTime(oneTime) {
    knex('dataTable')
        .insert(oneTime).then(() => {
            console.log('insert Success');
        })
        .catch((err) => {
            console.log(err);
            throw err
        }).finally(() => {
            knex.destroy()
        })

}

//插入一条标签
function insertLabel(label) {
    knex('labelTable')
        .insert(label).then(() => {
            console.log('insert Label Table Success');
        })
        .catch((err) => {
            console.log(err);
            throw err
        }).finally(() => {
            knex.destroy()
        })
}


//更新一条时间记录
function updateOneTime({ ID, recordDate, beginTime, endTime, firstLabel, secondLabel, timeNote }) {
    knex('dataTable')
        .where('ID', '=', ID)
        .update({
            recordDate,
            beginTime,
            endTime,
            firstLabel,
            secondLabel,
            timeNote
        }).then(() => {
            console.log('update Time Table Success');
        })
        .catch((err) => {
            console.log(err);
            throw err
        }).finally(() => {
            knex.destroy()
        })


}

// 删除一条时间记录
function deleteOneTime(ID) {
    knex('dataTable').where('ID', ID).del().then(() => {
        console.log('delete成功');
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        knex.destroy()
    })
}


//更新一条标签
function updateLabel({ID, firstLabel, secondLabel, timeNote}) {
    knex('labelTable')
    .where('ID', '=', ID)
    .update({
        firstLabel,
        secondLabel,
        timeNote
    }).then(() => {
        console.log('update label Table Success');
    })
    .catch((err) => {
        console.log(err);
        throw err
    }).finally(() => {
        knex.destroy()
    })
}

//统计一段时间的数据，标签和备注是可选项
function statTime(recordDate, beginDate, endDate, firstLabel = 'all', secondLabel = 'all', timeNote = 'all') {

}

//统计一天当中每个标签所花的时间，其中未记录的作为单独一个标签
function statOneDayTime(recordDate) {

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
                var beginTime = moment(row['beginTime'], 'YYYY-MM-DD HH:mm')
                var endTime = moment(row['endTime'], 'YYYY-MM-DD HH:mm')
                var timeSpan = endTime.diff(beginTime, 'minute', true)
                console.log(beginTime.format('YYYY-MM-DD HH:mm'), endTime.format('YYYY-MM-DD HH:mm'), timeSpan);
                if (labelTimeMap.has(firstLabel)) {
                    labelTimeMap.set(firstLabel, labelTimeMap.get(firstLabel) + timeSpan)
                } else {
                    labelTimeMap.set(firstLabel, timeSpan)
                }
                recordDateMinutes += timeSpan

                // console.log(`${row['ID']} ${row['recordDate']}  ${row['beginTime']} ${row['endTime']}  ${row['firstLabel']} ${row['secondLabel']}  ${row['timeNote']}`);
            });
            console.log('记录的时间：', recordDateMinutes);
            console.log('未记录的时间：', oneDayMinutes - recordDateMinutes);
            if (recordDateMinutes !== oneDayMinutes) {
                let errLabel = recordDateMinutes < oneDayMinutes ? '未记录的时间' : '多记录的时间'  //检查用户是少记录了时间还是多记录了时间
                labelTimeMap.set(errLabel, Math.abs(recordDateMinutes - oneDayMinutes))
            }
            console.log(labelTimeMap);

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
    timeNote: '睡眠fuck'
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
// statOneDayTime('2022-06-20')

// updateLabel({
//     ID: '1',
//     firstLabel: '娱乐',
//     secondLabel: '浏览',
//     timeNote: '浏览 锻炼YJ'

// })


var x = returnLabelTableData()
x.then((rows)=>{
    console.log('完成了！');
    console.log(rows);
}).catch((err)=>{
    console.log(err);
}).finally(() => {
    knex.destroy();
});
