const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});
const moment = require("moment")

function getFirstLabel() {
    return knex.from('labelTable').select("firstLabel").groupBy('firstLabel')
}


function getSecondLabel(firstLabel) {
    return knex.from('labelTable').select("secondLabel").where('firstLabel', '=', firstLabel)
}

//返回标签表的所有数据
function getAllLabel() {
    return knex.from('labelTable').select("*").orderBy('firstLabel')
}

//返回某一天的所有数据，输入参数为日期
function getOneDayData(recordDate) {
    recordDate = moment(recordDate).format('YYYY-MM-DD').toString()
    return knex.from('dataTable').
        select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
        where('recordDate', 'like', `%${recordDate}%`).orderBy('beginTime')
}

//插入一条时间记录
function insertTime(oneTime) {
    return knex('dataTable').insert(oneTime)
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
    return knex('dataTable').where('ID', ID).del()
}


//更新一条标签
function updateLabel({ ID, firstLabel, secondLabel, timeNote }) {
    knex('labelTable')
        .where('ID', '=', ID)
        .update({
            firstLabel,
            secondLabel,
            timeNote
        })
}

//统计一天当中每个标签所花的时间，其中未记录的作为单独一个标签
function statOneDayTime(recordDate) {
    recordDate = moment(recordDate).format('YYYY-MM-DD').toString()
    return knex.from('dataTable').
        select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
        where('recordDate', 'like', `%${recordDate}%`);
}


export default {
    getFirstLabel,
    getSecondLabel,
    getAllLabel,
    getOneDayData,
    insertTime,
    insertLabel,
    updateOneTime,
    deleteOneTime,
    updateLabel,
    statOneDayTime

}

