//用于初始化数据库文件
const sqlite3 = require('sqlite3').verbose()
var fs = require('fs')


let db;
let dbFileName = 'TimeRecorder.db'

function CreateDbFileAndTable() {
    console.log('不存在数据库文件，准备新建数据库')
    db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('创建数据库发生了错误:', err)
        }
        else {
            console.log('创建数据库成功，准备新建表');
            let createDataTableSql = `CREATE TABLE [dataTable](
                    [ID] INTEGER PRIMARY KEY AUTOINCREMENT, 
                    [recordDate] DATE, 
                    [beginTime] DATETIME, 
                    [endTime] DATETIME, 
                    [firstLabel] CHAR(50), 
                    [secondLabel] CHAR(50), 
                    [timeNote] CHAR
                  );`;
            let createLabelTableSql = `CREATE TABLE [labelTable](
                    [ID] INTEGER PRIMARY KEY AUTOINCREMENT, 
                    [firstLabel] CHAR(20), 
                    [secondLabel] CHAR(20), 
                    [timeNote] CHAR
                  );`;
            db.run(createDataTableSql, function (err) {
                if (err) {
                    console.error(err)
                }
            })
            db.run(createLabelTableSql, function (err) {
                if (err) {
                    console.error(err)
                }
            })
        }


    })
}

fs.exists(dbFileName, function (exists) {
    if (exists) {
        console.log('存在数据库文件');
    } else {
        CreateDbFileAndTable()
    }
})





