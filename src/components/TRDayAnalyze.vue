<template>
  <div id="TRDayAnalyzeBox">
    <div id="chinaChart"></div>
  </div>
</template>

<script>
import emitter from "@/utils/bus";
import DbUtils from "@/data/DbUtils";
import moment from "moment";
var myChart;

export default {
  name: "TRDayAnalyze",
  data() {
    return {
      caldayChoose: new Date(),
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
    };
  },
  methods: {
    refreshEcharts() {
      const oneDayMinutes = 24 * 60; //一天有多少分钟
      let recordDateMinutes = 0;
      var labelTimeMap;
      this.charOption.series[0].data = this.charOption.series[0].data.slice(0,0)  //清空原本的数据

      DbUtils.statOneDayTime(this.caldayChoose).then((rows) => {
        labelTimeMap = new Map();
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

        if (recordDateMinutes !== oneDayMinutes) {
          let errLabel =recordDateMinutes < oneDayMinutes ? "未记录的时间" : "多记录的时间"; //检查用户是少记录了时间还是多记录了时间
          labelTimeMap.set(errLabel, Math.abs(recordDateMinutes - oneDayMinutes));
        }

        labelTimeMap.forEach((value,key ) => {
          this.charOption.series[0].data.unshift({
            value: value,
            name: key,
          });
        });
        
        myChart.setOption(this.charOption);
      });
    },
  },
  mounted() {
    myChart = this.$echarts.init(document.getElementById("chinaChart"));
    this.$nextTick(this.refreshEcharts());
    emitter.on("sendCaldayChoose", (data) => {
      this.caldayChoose = data;
      this.refreshEcharts();
    });
  },
  onBeforeUnmount() {
    emitter.all.delete("sendCaldayChoose");
  },
};
</script>

<style scoped>
#TRDayAnalyzeBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


#chinaChart {
  width: 712px;
  height: 512px;
}
</style>