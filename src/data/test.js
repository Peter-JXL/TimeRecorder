const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    }
});

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

function returnOneDayData(dateInput) {
    dateInput = '2021-06-18'
    var data;
    knex.from('dataTable').
    select("ID", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
    where('recordDate', 'like', `%${dateInput}%`)
        .then((rows) => {
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

function updateOneTime(oneTime){
    console.log(oneTime);


}

function updateLabel(oneTime){
    console.log(oneTime);

}

function statTime(beginDate, endDate, firstLabel='all', secondLabel='all', timeNote='all'){

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
insertLabel(label)
