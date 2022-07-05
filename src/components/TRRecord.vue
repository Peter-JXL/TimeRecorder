<template>
  <div id="TRRecord">


    <div id="TRRecordLeft">
      <el-table 
      id="recordTable"
      :data="tableData" stripe border height="560" max-height="2000" 
      :header-cell-style="{'text-align': 'center'}"
      :cell-style="{'text-align':'center'}">
      >
        <el-table-column prop="beginTime" label="开始时间" width="85" />
        <el-table-column prop="endTime" label="结束时间" width="85" />
        <el-table-column prop="firstLabel" label="一级标签" width="100" />
        <el-table-column prop="secondLabel" label="二级标签" width="100" />
        <el-table-column prop="timeNote" label="备注" width="150" />
        <el-table-column label="操作" width="100" >
          <template #default="scope">
              <el-button size="small" @click="deleteOneTime(scope.row.ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <div id="TRRecordRight">
      <el-form-item>
        <el-calendar id='customizedCalendar'  v-model="caldayChoose" />
      </el-form-item>
      <el-form-item id="button">
        <el-button @click="skip('preDay')" type="success" round size="small">前一天</el-button>
        <el-button @click="skip('today')" type="info" round size="small">今天</el-button>
        <el-button @click="skip('postDay')" type="warning" round size="small">后一天</el-button>
      </el-form-item>

      <el-form :model="form" label-width="150px">
       <el-form-item label="开始时间：">
          <el-time-picker v-model="beginTime" format="HH:mm" />
       </el-form-item>

       <el-form-item label="结束时间：">
          <el-time-picker v-model="endTime" format="HH:mm" @keydown.enter="$refs.timeNote.focus()" />
       </el-form-item>

        <el-form-item label="一级标签：">
          <el-select v-model="firstLabelChoose" class="m-2"  clearable @change="loadSecondLabel">
            <el-option v-for="item in fisrtLabels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
       </el-form-item>

       <el-form-item label="二级标签：">
          <el-select v-model="secondLabelChoose"  clearable>
          <el-option
            v-for="item in secondLabels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          </el-select>
       </el-form-item>

        <el-form-item label="备注：" >
          <el-input ref="timeNote" v-model="timeNote" type="text" clearable  style="width:240px" @input="timeNoteChange"></el-input>
        </el-form-item>

        <el-form-item >
            <el-button type="primary" @click="addOneTime">添加</el-button>
            <el-button type="primary" @click="copyOneDayDataToMarkdown">复制当日记录</el-button>    
        </el-form-item>
      </el-form>

    </div>


  </div>
</template>

<script>
import moment from 'moment';
import DbUtils from '@/data/DbUtils';
import emitter from "@/utils/bus";
const {clipboard} = require( 'electron')
import showdown from 'showdown'

export default {
  name: "TRRecord",
  data() {
    return {
      tableData: [],   //一天的时间记录
      caldayChoose: new Date(),  //日历里的日期
      beginTime: new Date(), //用户输入的开始时间
      endTime: new Date(), //用户输入的结束时间
      firstLabelChoose: "", //用户选择的一级标签
      secondLabelChoose: "", //用户选择的二级标签
      timeNote: "", // 用户输入的时间备注
      fisrtLabels: [], //标签表里的所有一级标签，用于填充下拉框
      secondLabels: [], //标签表里所有的二级标签，用于填充下拉框
      allLabels:[],
      form: {} //表单数据，表单组件仅用于排版，但表单要求一定要绑定一个值，所以才设置的，实际无用处
    };
  },
  watch: {
    caldayChoose(){
        this.loadDayTime()
        this.beginTime.setDate(this.caldayChoose.getDate())
        this.endTime.setDate(this.caldayChoose.getDate())
        emitter.emit('sendCaldayChoose', this.caldayChoose)
    }
  },    
  methods: {
    loadDayTime(){
      this.tableData = this.tableData.splice(0, 0)
      DbUtils.getOneDayData(this.caldayChoose).then((rows)=>{
        rows.forEach(row=>{
          this.tableData.push({
            ID: row['ID'],
            beginTime: moment(row['beginTime']).format('HH:mm'),
            endTime:  moment(row['endTime']).format('HH:mm'),
            firstLabel: row['firstLabel'],
            secondLabel: row['secondLabel'],
            timeNote: row['timeNote']
          })
        })
      })
    },
    deleteOneTime(ID){
      DbUtils.deleteOneTime(ID).then(()=>{
        this.loadDayTime()
      })
    },
    loadFirstLabels(){
      this.fisrtLabels = this.fisrtLabels.splice(0, 0)
      DbUtils.getFirstLabel().then((rows)=>{    
        rows.forEach( row => {
          this.fisrtLabels.push({
            label:  row['firstLabel'],
            value:  row['firstLabel']
          })
        })
      })
    },
    loadAllLabels(){
      DbUtils.getAllLabel().then((rows)=>{
        rows.forEach( row => {
          this.allLabels.push(row)
        })
      })
    },
    loadSecondLabel(){
      this.secondLabelChoose = ''
      this.secondLabels = this.secondLabels.splice(0, 0)
      DbUtils.getSecondLabel(this.firstLabelChoose).then((rows)=>{    
        rows.forEach( row => {
          this.secondLabels.push({
            label:  row['secondLabel'],
            value:  row['secondLabel']
          })
        })
      })
    },
    skip(flag) {
      if (flag === 'preYear') this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() - 1));
      else if (flag === 'preDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() - 1));
      else if (flag === 'today') this.caldayChoose = new Date();
      else if (flag === 'postDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() + 1));
    },
    addOneTime(){
      let obj = {
        recordDate: moment(this.caldayChoose).format('YYYY-MM-DD'), 
        beginTime: moment(this.beginTime).format('YYYY-MM-DD HH:mm'), 
        endTime: moment(this.endTime).format('YYYY-MM-DD HH:mm'), 
        firstLabel: this.firstLabelChoose, 
        secondLabel: this.secondLabelChoose,
        timeNote: this.timeNote
      }
      DbUtils.insertTime(obj).then( ()=>{
          console.log('插入成功');
         this.loadDayTime()
      }).catch((err) => {
        console.log(err);
        throw err
      })
    },  
    timeNoteChange(){
      this.allLabels.forEach( label =>{
        if(-1 !== label.timeNote.indexOf(this.timeNote)){
          this.firstLabelChoose = label.firstLabel
          this.secondLabelChoose = label.secondLabel
        }
      })
      
    },
    createTable(tableData){
      var table = document.createElement('table')
      var thead = table.createTHead()
      var tbody = table.createTBody()

      thead.insertRow(0)
      var arr = ["开始时间","结束时间","一级标签","二级标签","备注"]
      for(let i = 0; i < arr.length; i++){
        var th = document.createElement('th')
        thead.rows[0].appendChild(th)
        thead.rows[0].cells[i].appendChild(document.createTextNode(arr[i]))
      }

      for(let i = 0; i<tableData.length; i++){
        tbody.insertRow(i)
        tbody.rows[i].insertCell(0)
        tbody.rows[i].cells[0].appendChild(document.createTextNode(this.tableData[i].beginTime))
        tbody.rows[i].insertCell(1)
        tbody.rows[i].cells[1].appendChild(document.createTextNode(this.tableData[i].endTime))
        tbody.rows[i].insertCell(2)
        tbody.rows[i].cells[2].appendChild(document.createTextNode(this.tableData[i].firstLabel))
        tbody.rows[i].insertCell(3)
        tbody.rows[i].cells[3].appendChild(document.createTextNode(this.tableData[i].secondLabel))
        tbody.rows[i].insertCell(4)
        tbody.rows[i].cells[4].appendChild(document.createTextNode(this.tableData[i].timeNote))
      }      
      return table    
    },
    copyOneDayDataToMarkdown(){
      var tableElement = this.createTable(this.tableData).outerHTML
      var conveter = new showdown.Converter({tables: true})
      var result = conveter.makeMarkdown(tableElement)
      clipboard.writeText(result)
    },
    updateOneTime(){

    },
    //提供当前日历日期给 TRDayAnalyze组件
    sendCaldayChoose(){

    }
  },
  mounted() {
    this.caldayChoose = new Date()
    this.loadDayTime()
    this.loadAllLabels()
    this.loadFirstLabels()    
    emitter.emit('sendCaldayChoose', this.caldayChoose)
  },
  onBeforeUnmount(){
    emitter.all.delete("sendCaldayChoose")
  }
};
</script>

<style lang="less" scoped>

#TRRecord{
  display: flex;
  justify-content: flex-start;
  align-items: space-between;
  width: 1200px;
  height: 580px;
}

#TRRecordLeft{
  width: 650px;
  height: 500px;
}

#TRRecordRight{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 400px;
  height: 580px;

  #button{
    display: flex;
    justify-content: center;

  }
}

#customizedCalendar {
  :deep(.el-calendar__header)  {
    // 修改头部背景颜色
    background-color: #57617c;
    padding: 3px 5px;
    border: none;
    display: flex;
    justify-content: center;

    .el-calendar__button-group {
      // 隐藏原生按钮
      display: none;
    }

    .el-calendar__title {
      // 修改头部标题的字体颜色
      color: white !important;
      font-size: 18px;
      font-weight: bolder;
    }
  }

  :deep(.el-calendar__body)  {
    // 修改主题部分
    padding: 0;
  }

  :deep(.el-calendar-table) {
    thead {
      th {
        // 修改头部星期部分
        padding: 0;
        background-color: #57617c;
        color: white;
      }
    }

    .is-selected {
      .el-calendar-day {
        p {
          // 选中日期颜色
          color: black;
        }
      }
    }

    .el-calendar-day {
      // 每天小块样式设置
      padding: 0;
      height: 25px;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;

      p {
        // 所有日期颜色
        color: black;
        z-index: 1;
        user-select: none;
        display: flex;
      }
    }
  }

  :deep(.el-calendar-table__row) {

    .prev,
    .next {

      // 修改非本月
      .el-calendar-day {
        p {
          color: #f0d9d5;
        }
      }
    }

    td {

      // 修改每一个日期td标签
      &:first-child,
      &:last-child {
        background-color: #f5f5f5;
      }
    }
  }
  button { 
    padding: 3px 10px;
  }
}

</style>