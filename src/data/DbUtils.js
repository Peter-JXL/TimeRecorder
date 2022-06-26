const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});
const moment = require( "moment")

var data;

async function getLabelTableData(){
    data = await knex.from('labelTable').select("*")
    console.log(data);
    return data
}

//返回labelTable的所有值
async function returnLabelTableData() {
    data = await knex.from('labelTable').select("*")
}



//返回某一天的所有数据，输入参数为日期
function returnOneDayData(recordDate) {
    recordDate = moment(recordDate).format('YYYY-MM-DD ').toString()
    var data;
    knex.from('dataTable').
        select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
        where('recordDate', 'like', `%${recordDate}%`)
        .then((rows) => {
            console.log(`返回${recordDate}的数据,共${rows.length}行`);
            data = rows
            // rows.forEach(row => {
            //     console.log(`${row['ID']} ${row['recordDate']}  ${row['beginTime']} ${row['endTime']}  ${row['firstLabel']} ${row['secondLabel']}  ${row['timeNote']}`);
            // });
            return data
        })
        .catch((err) => { console.log('发生了错误:',err); throw err })
    
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
        })


}

// 删除一条时间记录
function deleteOneTime(ID) {
    knex('dataTable').where('ID', ID).del().then(() => {
        console.log('delete成功');
    }).catch((err) => {
        console.log(err);
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
    })
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
                // console.log(beginTime.format('YYYY-MM-DD HH:mm'), endTime.format('YYYY-MM-DD HH:mm'), timeSpan);
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


export default {
    getLabelTableData,
    returnLabelTableData,
    returnOneDayData,
    insertTime,
    insertLabel,
    updateOneTime,
    deleteOneTime,
    updateLabel,
    statOneDayTime

}

