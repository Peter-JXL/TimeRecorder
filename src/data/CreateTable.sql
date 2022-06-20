--建表语句
CREATE TABLE dataTable(
   id integer  PRIMARY KEY AUTOINCREMENT,
   beginTime datetime,
   endTime datetime,
   firstLabel text,
   secondLabel text,
   timeNote text
);


CREATE TABLE labelTable(
   id datatype  PRIMARY KEY,
   firstLabel text,
   secondLabel text,
   labelNote text
);