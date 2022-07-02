<template>
  <div id="TRDayAnalyzeBox">
    <div id="chinaChart" style="  height: 600px; width: 500px;"></div>
    <div id="ana">
      <el-button @click="refreshEcharts" type="primary">刷新</el-button>
    </div>
  </div>
</template>

<script>
import emitter from "@/utils/bus";

export default {
  name: "TRDayAnalyze",
  data() {
    return {
      caldayChoose: new Date(),
      charOption: {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {},
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
        ],
      },
    }
  },
  methods: {
    refreshEcharts() {
      
    },    
  },
  onMounted(){

  },
  mounted() {
    this.refreshEcharts();
    const myChart = this.$echarts.init(document.getElementById("chinaChart"));
    // 绘制图表
    myChart.setOption(this.charOption);
    emitter.on("sendCaldayChoose", (data) => {
      this.caldayChoose = data
      console.log(this.caldayChoose);
    });
  },
  created() {
    
  },
  onBeforeUnmount(){
    emitter.all.delete("sendCaldayChoose")
  }
 
  
};
</script>

<style scoped>
#TRDayAnalyzeBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#ana {
  border: 1px solid green;
  width: 500px;
  height: 500px;
}
</style>