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
import moment from "moment";
var myChart;


export default {
  name: 'TRDaysAnalyze',
  data() {
    return {
      beginDate: '',
      endDate: '',
      chartType: 'pie',
      showToolTip: true,
      charOption: {
        title: {
          text: "当日数据统计",
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: '{b} {c}分钟  占比{d}%'
        },
        legend: {
          top: "5%",
          left: "center",
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        series: [
          {
            name: "当日数据统计",
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
    //统计开始日期（含）到结束日期（含）之间的数据，每个一级标签花了多少时间
    statistics(){    
      let beginDate =  moment(this.beginDate, "YYYY-MM-DD");
      let endDate =  moment(this.endDate, "YYYY-MM-DD").add(1,'d');
      let days = endDate.diff(beginDate, 'days')

      let daysMinutes = days * 24 * 60; //总共多少分钟
      let recordDateMinutes = 0  //统计用户记录的分钟数
      let labelTimeMap = new Map();
      this.charOption.series[0].data = this.charOption.series[0].data.slice(0,0)  //清空原本的数据

      DbUtils.statDasyTime(beginDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")).then( rows =>{
        rows.forEach((row) => {
          var firstLabel = row["firstLabel"];
          var beginTime = moment(row["beginTime"], "YYYY-MM-DD HH:mm");
          var endTime = moment(row["endTime"], "YYYY-MM-DD HH:mm");
          var timeSpan = endTime.diff(beginTime, "minute");

          if (labelTimeMap.has(firstLabel)) {
            labelTimeMap.set(firstLabel,labelTimeMap.get(firstLabel) + timeSpan);
          } else {
            labelTimeMap.set(firstLabel, timeSpan, labelTimeMap);
          }
          recordDateMinutes += timeSpan;
        });

        //不相等则说明用户有未记录的时间，或者多记录的时间
        if (recordDateMinutes !== daysMinutes) {
          let errLabel = recordDateMinutes < daysMinutes ? "未记录的时间" : "多记录的时间"; //检查用户是少记录了时间还是多记录了时间
          labelTimeMap.set(errLabel, Math.abs(recordDateMinutes - daysMinutes));
        }

        //将
        labelTimeMap.forEach((value,key ) => {
          this.charOption.series[0].data.unshift({
            value: value,
            name: key,
          });
        });
        
        myChart.setOption(this.charOption);
      })
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
    myChart = this.$echarts.init(document.getElementById("chinaChartDays"));
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