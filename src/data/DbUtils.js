const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});


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




export default {
    returnLabelTableData,
    returnOneDayData,
    insertTime,
    insertLabel,
    updateOneTime,
    deleteOneTime,
    updateLabel

}

