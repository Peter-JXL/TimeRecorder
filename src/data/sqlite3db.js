const sqlite3 = require('sqlite3').verbose()
var fs = require('fs')


let db;
let dbFileName = 'TimeRecorder.db'

function  isExistsDataBaseFile(){
    return true;
}

function InitDb(){
    if(isExistsDataBaseFile){
        console.log('已有数据库文件，使用其数据')
    }else{
        db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
            if(err){
                console.error(err)
            }
            else{
                console.log('连接test.db成功');
            }
    
            let createTableSql = `create table if not exists t_products(
                id integer primary key autoincrement,
                product_name varchar(100) not null,
                price float not null
            )`;
            db.run(createTableSql,function(err){
                if(err){
                    console.error(err)
                }
            })
        })
    }
}


InitDb();
export default db