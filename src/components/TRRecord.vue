<template>
  <div id="TRRecord">


    <div id="TRRecordLeft">
      <el-table 
      id="recordTable"
      :data="tableData" stripe border height="560" max-height="2000" 
      :header-cell-style="{'text-align': 'center'}"
      :cell-style="{'text-align':'center'}"
      show-overflow-tooltip="true"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @cell-dblclick="editTimeData"
      >
        <el-table-column prop="beginTime" label="开始时间" width="110" sortable />
        <el-table-column prop="endTime" label="结束时间" width="110" sortable/>
        <el-table-column prop="firstLabel" label="一级标签" width="110" sortable />
        <el-table-column prop="secondLabel" label="二级标签" width="110" sortable />
        <el-table-column prop="timeNote" label="备注" width="150">
          <template #default="scope">
            <el-input v-if="scope.row['isShow']" v-model="scope.row.timeNote" @blur="updateTimeNote(scope.row)" />
            <span v-else>{{scope.row.timeNote}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" >
          <template #default="scope">
              <el-button size="small" @click="deleteOneTime(scope.row.ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <div id="TRRecordRight">
      <el-form-item>
        <el-calendar id='customizedCalendar'  v-model="caldayChoose"></el-calendar>
      </el-form-item>
      <el-form-item id="button">
        <el-button @click="skip('preYear')" type="success" round size="small">←年</el-button>
        <el-button @click="skip('preMonth')" type="success" round size="small">←月</el-button>
        <el-button @click="skip('preDay')" type="success" round size="small">←天</el-button>
        <el-button @click="skip('today')" type="info" round size="small">今天</el-button>
        <el-button @click="skip('postDay')" type="warning" round size="small">→天</el-button>
        <el-button @click="skip('postMonth')" type="warning" round size="small">→月</el-button>
        <el-button @click="skip('postYear')" type="warning" round size="small">→年</el-button>
      </el-form-item>

      <el-form label-width="150px">
        <el-form-item label="开始时间：">
          <input type="date" v-model="beginDate"  class="myInput inputDate" >
          <input type="time" v-model="beginTime"  class="myInput inputTime" @keydown.enter="$refs.endTime.focus()" >
        </el-form-item>

        <el-form-item label="结束时间：">
          <input type="date" v-model="endDate" class="myInput inputDate" @keydown.enter="$refs.timeNote.focus()">
          <input type="time" v-model="endTime" class="myInput inputTime" ref="endTime" @keydown.enter="$refs.timeNote.focus()" >
        </el-form-item>

        <el-form-item label="一级标签：">
          <el-select v-model="firstLabelChoose"  clearable @change="loadSecondLabel">
            <el-option v-for="item in fisrtLabels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
       </el-form-item>

       <el-form-item label="二级标签：">
          <el-select v-model="secondLabelChoose"  clearable>
          <el-option
            v-for="item in secondLabels" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
       </el-form-item>

        <el-form-item label="备注：" >
          <el-input ref="timeNote" v-model="timeNote" 
                    type="text" clearable  style="width:240px" @input="timeNoteChange"
                    @keydown.enter="$refs.addOneTime1.ref.focus()" >
          </el-input>
        </el-form-item>

        <el-form-item >
            <el-button type="primary" @click="addOneTime" ref="addOneTime1">添加</el-button>
            <el-button type="primary" @click="copyOneDayDataToMarkdown">复制当日学习记录</el-button>    
        </el-form-item>
      </el-form>

    </div>


  </div>
</template>

<script>
import DbUtils from '@/data/DbUtils'
import emitter from "@/utils/bus"
const {clipboard} = require('electron')
import showdown from 'showdown'
import moment from 'moment'
import { ElMessage  } from 'element-plus'

export default {
  name: "TRRecord",  
  data() {
    return {
      tableData: [],   //一天的时间记录
      caldayChoose: new Date(),  //日历里的日期
      beginDate: '',      
      beginTime: '',
      endDate: '',
      endTime:'',
      firstLabelChoose: '',   //用户选择的一级标签
      secondLabelChoose: '',  //用户选择的二级标签
      timeNote: '',           //用户输入的时间备注
      fisrtLabels: [],        //标签表里的所有一级标签，用于填充下拉框
      secondLabels: [],       //标签表里所有的二级标签，用于填充下拉框
      allLabels: new Map(),   //标签表里所有的数据，用于在备注变化时更新标签选择框
    };
  },
  watch: {
    caldayChoose(){
      this.loadDayTime()
      emitter.emit('sendCaldayChoose', this.caldayChoose)  //将日历选中的日期发给当日时间分析组件，用于展示饼图
      this.beginDate = moment(this.caldayChoose).format('yyyy-MM-DD')
      this.endDate = moment(this.caldayChoose).format('yyyy-MM-DD')
    }, 
  },    
  methods: {
    //加载一天的数据
    loadDayTime(){
      this.tableData = this.tableData.splice(0, 0)   //清空原始数据
      DbUtils.getOneDayData(this.caldayChoose).then((rows)=>{
        //填充当天数据到表格里
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
        //将当天最后一条记录的时间填充到时间输入框里，方便用户录入下一条时间
        if(0 !== rows.length ){  //当日没记录时间
          let lastRecord = rows[rows.length - 1]
          this.beginTime = moment(lastRecord['endTime']).format('HH:mm')
          this.endTime = moment(lastRecord['endTime']).format('HH:mm')  
          this.$refs.endTime.focus()
        }else{
          this.beginTime = this.endTime = '00:00'          
          this.$nextTick( ()=>{
            this.$refs.endTime.focus()
          });
        } 
        
        //当数据有insert或者delete的时候，都会调用loadDayTime方法，然后触发事件告诉当日时间标签栏更新数据
        emitter.emit('sendCaldayChoose', this.caldayChoose)  
      })
    },
    //删除一条时间记录
    deleteOneTime(ID){
      DbUtils.deleteOneTime(ID).then(()=>{
        this.loadDayTime();
        ElMessage({
          message:'删除成功',
          type: 'success'
        })
      })
    },
    //加载一级标签并填充到下拉框
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
    //加载全部标签，用于备注变化的时候填充下拉框
    loadAllLabels(){
      this.allLabels.clear() //清空原始数据
      DbUtils.getAllLabel().then((rows)=>{
        rows.forEach( row => {
          var secondLabelWords = row['timeNote'].split(" ")
          for(var word of secondLabelWords){
            this.allLabels.set(word, row['firstLabel']);
          }
        })
      })
      
    },
    //用户选中一级标签的时候，自动填充该一级标签下的二级标签
    loadSecondLabel(){
      this.secondLabelChoose = ''
      this.secondLabels = this.secondLabels.splice(0, 0)  //清空原始数据
      DbUtils.getSecondLabel(this.firstLabelChoose).then((rows)=>{    
        rows.forEach( row => {
          this.secondLabels.push({
            label:  row['secondLabel'],
            value:  row['secondLabel']
          })
        })
      })
    },
    //日历组件当前日期变化
    skip(flag) {
      switch(flag){
        case 'preYear': this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() - 1)); break
        case 'preMonth': this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() - 1));break
        case 'preDay': this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() - 1));break
        case 'today': this.caldayChoose = new Date(); break;
        case 'postDay': this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() + 1));break
        case 'postMonth': this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() + 1));break
        case 'postYear': this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() + 1));break
        default: break;
      }
    },
    //添加一条时间记录
    addOneTime(){
      let obj = {
        recordDate: moment(this.caldayChoose).format('YYYY-MM-DD'), 
        beginTime: moment(`${this.beginDate} ${this.beginTime}`).format('YYYY-MM-DD HH:mm'), 
        endTime: moment(`${this.endDate} ${this.endTime}`).format('YYYY-MM-DD HH:mm'), 
        firstLabel: this.firstLabelChoose, 
        secondLabel: this.secondLabelChoose,
        timeNote: this.timeNote
      }
      DbUtils.insertTime(obj).then( ()=>{
        this.loadDayTime()
        this.$nextTick(()=>{
          this.beginTime = this.endTime
          this.$refs.endTime.focus()
          this.timeNote = ''
          ElMessage({
            message:'成功添加',
            type: 'success'
          })
        })
      })
    },  
    editTimeData(row){
      row['isShow'] = true
    },
    //修改一条时间记录
    updateTimeNote(row){
      let {ID, timeNote } = row
      DbUtils.updateOneTime({ID, timeNote}).then(()=>{
        ElMessage({message:'修改成功', type: 'success'})
        row['isShow'] = false
      })
    },
    //当用户输入的备注里包含二级标签的时候，自动填充一级和二级标签
    timeNoteChange(){
      if(this.allLabels.has(this.timeNote)){
          this.firstLabelChoose = this.allLabels.get(this.timeNote)
          this.secondLabelChoose = this.timeNote
      }
    },
    //根据当天日期数据生成一个table dom元素
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

      let fisrtLabels = ['学习成长', '事业']
      for(let i = 0, j = 0; i<tableData.length; i++){

        if(fisrtLabels.includes( this.tableData[i].firstLabel )){
          tbody.insertRow(j)  // J用于table dom元素的插入下标
          tbody.rows[j].insertCell(0)
          tbody.rows[j].cells[0].appendChild(document.createTextNode(this.tableData[i].beginTime))
          tbody.rows[j].insertCell(1)
          tbody.rows[j].cells[1].appendChild(document.createTextNode(this.tableData[i].endTime))
          tbody.rows[j].insertCell(2)
          tbody.rows[j].cells[2].appendChild(document.createTextNode(this.tableData[i].firstLabel))
          tbody.rows[j].insertCell(3)
          tbody.rows[j].cells[3].appendChild(document.createTextNode(this.tableData[i].secondLabel))
          tbody.rows[j].insertCell(4)
          tbody.rows[j].cells[4].appendChild(document.createTextNode(this.tableData[i].timeNote))
          j++;
        }        
      }      
      return table    
    },
    //将当天日期数据转换为Markdown表格，并复制到剪贴板，用showdown转换createTable方法生成的table dom元素
    copyOneDayDataToMarkdown(){
      var tableElement = this.createTable(this.tableData).outerHTML
      var conveter = new showdown.Converter({tables: true})
      var result = conveter.makeMarkdown(tableElement)
      clipboard.writeText(result)
      ElMessage({message:'复制成功', type: 'success'})
    },
  },
  //启动时自动加载当天数据
  mounted() {
    this.caldayChoose = new Date()
    this.loadDayTime()
    this.loadAllLabels()
    this.loadFirstLabels()    
    emitter.emit('sendCaldayChoose', this.caldayChoose)    

    //监听标签表更新事件，当标签页数据有更新的时候，更新当前标签数据
    emitter.on("sendLabels", () => {  
      this.loadAllLabels()
    });
  },
  //销毁时取消事件总线
  onBeforeUnmount(){
    emitter.all.delete("sendCaldayChoose")
    emitter.all.delete("sendLabels")
  }
};
</script>

<style lang="less" scoped>

#TRRecord{
  display: flex;
  justify-content: flex-start;
  align-items: space-between;
  width: 1300px;
  height: 580px;
}

#TRRecordLeft{
  width: 800px;
  height: 500px;
}

#TRRecordRight{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 450px;
  height: 580px;

  #button{
    display: flex;
    justify-content: center;
  }
}



#customizedCalendar {
  #selectP {
    width: 30px;
    height: 30px;
    background-color: #15ff2c;
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
  }


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

    .prev,.next {
      // 修改非本月日期颜色
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

.myInput{
  font-family: Arial, Helvetica, sans-serif;
  font-size: inherit;
  color: #606266;
  border-color: #dcdfe6;
  border-radius: 4px;  
  height: 30px;
  line-height: 30px;
}

.myInput:focus {
  border-color: #409eff;
}
.myInput:focus-visible{
  outline: #409eff;

}
.myInput:hover{
  border-color: #c0c4cc;
}

.inputDate{
  width: 124px;
}

.inputTime{
  width: 80px;
}

</style>