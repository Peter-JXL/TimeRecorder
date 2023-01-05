const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    },
    useNullAsDefault: true
});
const moment = require("moment")

//获取所有一级标签
function getFirstLabel() {
    return knex.from('labelTable').select("firstLabel").groupBy('firstLabel')
}

//获取所有二级标签
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
    return knex('labelTable').insert(label)
}


//更新一条时间记录
function updateOneTime({ ID, beginTime, endTime, firstLabel, secondLabel, timeNote }) {
    return knex('dataTable')
        .where('ID', '=', ID)
        .update({
            beginTime,
            endTime,
            firstLabel,
            secondLabel,
            timeNote
        })


}

// 删除一条时间记录
function deleteOneTime(ID) {
    return knex('dataTable').where('ID', ID).del()
}

// 删除一条标签
function deleteOneLabel(ID) {
    return knex('labelTable').where('ID', ID).del()
}

//更新一条标签
function updateLabel({ ID, firstLabel, secondLabel, timeNote }) {
    return knex('labelTable').where('ID', '=', ID).update({firstLabel, secondLabel, timeNote })
}

//统计一天当中每个标签所花的时间，其中未记录的作为单独一个标签
function statOneDayTime(recordDate) {
    recordDate = moment(recordDate).format('YYYY-MM-DD').toString()
    return knex.from('dataTable').
        select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
        where('recordDate', 'like', `%${recordDate}%`);
}

//统计一段时间中每个标签所花的时间，其中未记录的作为单独一个标签
function statDasyTime(beginDate, endDate) {
    return knex.from('dataTable').
        select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
        where('recordDate', '>=', beginDate).
        andWhere('recordDate', '<=', endDate)
}


export default {
    getFirstLabel,
    getSecondLabel,
    getAllLabel,
    getOneDayData,
    insertTime,
    insertLabel,
    updateOneTime,
    deleteOneLabel,
    deleteOneTime,
    updateLabel,
    statOneDayTime,
    statDasyTime
}

