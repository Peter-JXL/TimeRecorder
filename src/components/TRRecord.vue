<template>
  <el-row :gutter="20">
    <el-col :span="14">
      <el-table :data="tableData" stripe border height="528" max-height="2000">
        <el-table-column prop="beginTime" label="开始时间" width="85" />
        <el-table-column prop="endTime" label="结束时间" width="85" />
        <el-table-column prop="firstLabel" label="一级标签" width="100" />
        <el-table-column prop="secondLabel" label="二级标签" width="100" />
        <el-table-column prop="timeNote" label="备注" width="120" />
      </el-table>
    </el-col>

    <el-col :span="10">  
      <el-calendar id='customizedCalendar'  v-model="caldayChoose" />
      <br/>
      <div id="button">
        <el-button @click="skip('preYear')" type="primary" round size="small">去年</el-button>
        <el-button @click="skip('preMonth')" type="warning" round size="small">上月</el-button>
        <el-button @click="skip('preDay')" type="success" round size="small">昨日</el-button>
        <el-button @click="skip('today')" type="info" round size="small">今天</el-button>
      </div>
      <br/>

      <el-form :model="form" label-width="120px">
       <el-form-item label="开始时间：">
          <el-time-picker v-model="beginTime" format="HH:mm" />
       </el-form-item>

       <el-form-item label="结束时间：">
          <el-time-picker v-model="endTime" format="HH:mm" />
       </el-form-item>

        <el-form-item label="一级标签：">
          <el-select v-model="firstLabelChoose" class="m-2" size="large" clearable @change="loadSecondLabel">
            <el-option v-for="item in fisrtLabels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
       </el-form-item>

       <el-form-item label="二级标签：">
          <el-select v-model="secondLabelChoose" class="m-2" size="large" clearable>
          <el-option
            v-for="item in secondLabels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
          </el-select>
       </el-form-item>

        <el-form-item label="备注：">
          <el-input v-model="timeNote" clearable></el-input>
        </el-form-item>
      </el-form>
      

      <el-row>
        
      </el-row><br/>
      

      <el-row>
        <el-button type="primary" @click="addOneTime">添加</el-button>
        <el-button type="primary" @click="copyOneDayDataToExcel">复制当日记录到Excel表格</el-button>        
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import DbUtils from '@/data/DbUtils';
import moment from 'moment';

export default {
  name: "TRRecord",
  data() {
    return {
      tableData: [],
      caldayChoose:  new Date(),
      beginTime: "", //用户输入的开始时间
      endTime: "", //用户输入的结束时间
      firstLabelChoose: "", //用户选择的一级标签
      secondLabelChoose: "", //用户选择的二级标签
      timeNote: "", // 用户输入的时间备注
      fisrtLabels: [], //标签表里的所有一级标签，用于填充下拉框
      secondLabels: [], //标签表里所有的二级标签，用于填充下拉框
      form: {}
    };
  },
  watch: {
    caldayChoose(){
        this.loadDayTime()
    }
  },    
  methods: {
    loadDayTime(){
      this.tableData = this.tableData.splice(0, 0)
      DbUtils.getOneDayData(this.caldayChoose).then((rows)=>{
        rows.forEach(row=>{
          this.tableData.push({
            ID: row['id'],
            beginTime: moment(row['beginTime']).format('HH:mm'),
            endTime:  moment(row['endTime']).format('HH:mm'),
            firstLabel: row['firstLabel'],
            secondLabel: row['secondLabel'],
            timeNote: row['timeNote']
          })
        })
      })
    },
    loadLabels(){
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
    loadSecondLabel(){
      this.secondLabels = this.secondLabels.splice(0, 0)
      DbUtils.getSecondLabel(this.firstLabelChoose).then((rows)=>{    
        console.log(rows);
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
      else if (flag === 'preMonth') this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() - 1));
      else if (flag === 'preDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() - 1));
      else if (flag === 'today') this.caldayChoose = new Date();
      else if (flag === 'postDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() + 1));
      else if (flag === 'postMonth') this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() + 1));
      else if (flag === 'postYear') this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() + 1));
    },
    addOneTime(){

    },  
    copyOneDayDataToExcel(){

    },
    updateOneTime(){

    }
  },
  mounted() {
    this.caldayChoose = new Date()
    this.loadDayTime()
    this.loadLabels()    
  }
};
</script>

<style lang="less" scoped>
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