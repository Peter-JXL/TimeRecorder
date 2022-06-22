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


//returnLabelTableData()
//returnOneDayData()



