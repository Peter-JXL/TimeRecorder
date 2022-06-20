const sqlite3 = require('sqlite3').verbose()
var fs = require('fs')


let db;
let dbFileName = 'TimeRecorder.db'

function  isExistsDataBaseFile(){
    fs.exists(dbFileName, function(exists){
        if(exists){       
            return true;
        }else{
            return false
        }
    })
}

function InitDb(){
    if(isExistsDataBaseFile()){
        console.log('已有数据库文件，使用其数据')
    }else{
        console.log('不存在数据库文件，准备新建数据库')
        db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
            if(err){
                console.error('创建数据库发生了错误:' , err)
            }
            else{
                console.log('创建数据库成功，准备新建表');
            }
    
            let createDataTableSql = `CREATE TABLE dataTable(
                id integer  PRIMARY KEY AUTOINCREMENT,
                beginTime datetime,
                endTime datetime,
                firstLabel text,
                secondLabel text,
                timeNote text
             );`;
             let createLabelTableSql = `CREATE TABLE labelTable(
                id integer  PRIMARY KEY AUTOINCREMENT,
                beginTime datetime,
                endTime datetime,
                firstLabel text,
                secondLabel text,
                timeNote text
             );`;
            db.run(createDataTableSql,function(err){
                if(err){
                    console.error(err)
                }
            })
            db.run(createLabelTableSql,function(err){
                if(err){
                    console.error(err)
                }
            })
        })
    }
}


InitDb();


