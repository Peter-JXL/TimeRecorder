const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './TimeRecorder.db'
    }
});

function returnLabelTable() {
    var data;
    knex.from('labelTable').select("*").then((rows) => {
        data = rows
    }).catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
    return data
}

function returnOneDayData(dateInput) {
    var data;
    knex.from('dataTable').
    select("rowid", "recordDate", 'beginTime', 'endTime', 'firstLabel', 'secondLabel', 'timeNote').
    where('recordDate', 'like', dateInput)
        .then((rows) => {
            data = rows
        })
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        });
    return data
}


export default {
    returnLabelTable,
    returnOneDayData,

}

