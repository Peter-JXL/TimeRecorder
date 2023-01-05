<template>
  <div id="TRDaysAnalyzeBox">


    <div id="chinaChartDays"></div>


    <div id="chinaChartOptions">
      <el-form label-width="100px">
         <el-form-item label="开始日期：">
          <input type="date" v-model="beginDate"  class="myInput inputDate" @keydown.enter="$refs.endTime.focus()" >
        </el-form-item>

         <el-form-item label="结束日期：">
          <input type="date" v-model="endDate"  class="myInput inputDate" >
        </el-form-item>

        <el-form-item label="图表类型：">
          <el-radio-group v-model="chartType">
            <el-radio label="pie" >饼图</el-radio>
            <el-radio label="pie2" disabled>圆环图</el-radio>
            <el-radio label="bar" disabled>柱状图</el-radio>
            <el-radio label="funnel" disabled>漏斗图</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="图表设置：">
          <el-checkbox v-model="showLegend" label="显示图例" size="large" />
        </el-form-item>

        <el-form-item >
            <el-button type="primary" @click="statistics">统计</el-button>
        </el-form-item>
        <el-form-item >
          <ul>
            <li>统计总天数：{{this.summary.recordDays}}</li>
            <li>统计总分钟数：{{this.summary.minutesOfrecordDays}}</li>
            <li>记录的总分钟数：{{this.summary.minutesOfUserRecord}}</li>
          </ul>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import DbUtils from '@/data/DbUtils'
import moment from "moment";
var myChart;


export default {
  name: 'TRDaysAnalyze',
  data() {
    return {
      beginDate: '',  //统计开始日期（含）
      endDate: '',    //统计结束日期（含）
      chartType: 'pie',  //图表类型
      showLegend: true,  //是否显示图例
      charOption: {
        title: {
          text: "数据统计", //图表标题
        },
        tooltip: { //鼠标放到图标上时的提示
          show: true,  //是否显示
          trigger: "item",  //放到哪里时显示，数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          formatter: '{b} {c}分钟  占比{d}%'   //提示的格式  饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
        },
        legend: {
          show: true,
          top: "center",
          left: "0%",
          orient: 'vertical'  //图例竖着显示
        },
        toolbox: { //工具箱
          feature: { 
            saveAsImage: {}  //下载图片
          }
        },
        series: [
          {
            name: "数据统计",
            type: "pie",
            radius: "50%",
            label:{
              formatter: '{b}: {c}分钟 '
            },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      summary:{ //年度统计用
        recordDays: 0,
        minutesOfrecordDays: 0,
        minutesOfUserRecord: 0
      }
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
    showLegend(){
      this.charOption.legend.show = !this.charOption.legend.show
      myChart.setOption(this.charOption);
    }
  },
  methods: {
    //统计开始日期（含）到结束日期（含）之间的数据，每个一级标签花了多少时间
    statistics(){    
      let beginDate = moment(this.beginDate, "YYYY-MM-DD")
      let endDate = moment(this.endDate, "YYYY-MM-DD")
      let days = endDate.diff(beginDate, 'days') + 1   //计算总共多少天
      let daysMinutes = days * 24 * 60; //总共多少分钟
      console.log("daysMinutes", daysMinutes)
      let recordDateMinutes = 0  //统计用户记录的分钟数
      let labelTimeMap = new Map()  //存放分钟数和标签
      this.charOption.series[0].data = this.charOption.series[0].data.slice(0,0)  //初始化

      DbUtils.statDasyTime(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")).then( rows =>{
        rows.forEach((row) => {
          var firstLabel = row["firstLabel"];
          var beginTime = moment(row["beginTime"], "YYYY-MM-DD HH:mm")
          var endTime = moment(row["endTime"], "YYYY-MM-DD HH:mm")
          var timeSpan = endTime.diff(beginTime, "minute")

          if (labelTimeMap.has(firstLabel)) {
            labelTimeMap.set(firstLabel,labelTimeMap.get(firstLabel) + timeSpan);
          } else {
            labelTimeMap.set(firstLabel, timeSpan);
          }
          recordDateMinutes += timeSpan;
        })

        //不相等则说明用户有未记录的时间，或者多记录的时间
        if (recordDateMinutes !== daysMinutes) {
          this.$log.info("TRDaysAnalyze recordDateMinutes: " + recordDateMinutes);
          this.$log.info("TRDaysAnalyze oneDayMinutes: " + daysMinutes);
          let errLabel = recordDateMinutes < daysMinutes ? "未记录的时间" : "多记录的时间"; //检查用户是少记录了时间还是多记录了时间
          labelTimeMap.set(errLabel, Math.abs(recordDateMinutes - daysMinutes));
        }

        //将计算好的数据放到图表里
        labelTimeMap.forEach((value,key ) => {
          this.charOption.series[0].data.unshift({
            value: value,
            name: key,
          })
        })
        
        myChart.setOption(this.charOption)

        this.summary.recordDays = days 
        this.summary.minutesOfrecordDays = daysMinutes
        this.summary.minutesOfUserRecord = recordDateMinutes
        
      })
    },
    loadPie(){
      this.charOption.series[0].type = 'pie'
      myChart.setOption(this.charOption)
    },
    loadPie2(){

    },
    loadBar(){
      this.charOption.series[0].type = 'bar'
      console.log(this.charOption)
      myChart.setOption(this.charOption);
    },
    loadFunnel(){

    },
  },
  mounted() {
    myChart = this.$echarts.init(document.getElementById("chinaChartDays"))
    this.beginDate = this.endDate = moment().format('YYYY-MM-DD')
    this.statistics()
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