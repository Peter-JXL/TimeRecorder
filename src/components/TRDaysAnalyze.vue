<template>
  <div id="TRDaysAnalyzeBox">


    <div id="chinaChartDays">
      
    </div>


    <div id="chinaChartOptions">
      <el-form label-width="100px">
         <el-form-item label="开始日期：">
          <input type="date" v-model="beginDate"  class="myInput inputDate" @keydown.enter="$refs.endTime.focus()" >
        </el-form-item>

         <el-form-item label="结束日期：">
          <input type="date" v-model="beginDate"  class="myInput inputDate" >
        </el-form-item>

        <el-form-item label="图表类型：">
          <el-radio-group v-model="chartType">
            <el-radio label="pie">饼图</el-radio>
            <el-radio label="pie2">圆环图</el-radio>
            <el-radio label="bar">柱状图</el-radio>
            <el-radio label="funnel">漏斗图</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="图表设置：">
          <el-checkbox v-model="showToolTip" label="显示图例" size="large" />
        </el-form-item>

        <el-form-item >
            <el-button type="primary" @click="statistics">统计</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import DbUtils from '@/data/DbUtils'
import moment from 'moment'
var myChart;


export default {
  name: 'TRDaysAnalyze',
  data() {
    return {
      beginDate: '2022-07-13',
      endDate: '2022-07-13',
      chartType: 'pie',
      showToolTip: true,
    }
  },
  watch:{
    chartType(){
      switch(this.chartType){
        case 'pie' : this.loadPie(); break;
        case 'pie2' : this.loadPie2(); break;
        case 'bar' : this.loadBar(); break;
        case 'funnel' : this.loadFunnel(); break;
      }
    },
    showToolTip(){
       
    }
  },
  methods: {
    statistics(){

    },
    loadPie(){

    },
    loadPie2(){

    },
    loadBar(){

    },
    loadFunnel(){

    },
  },
  mounted() {
    
  },

}
</script>

<style>
#TRDaysAnalyzeBox{
    display: flex;
    justify-content: flex-start;
    align-items: space-between;
    width: 1200px;
    height: 580px;
  }

  #chinaChartDays{
    width: 900px;
    height: 580px;
  }

  #chinaChartOptions{
    display: flex;
    align-items: center;

    width: 500px;
    height: 580px;
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