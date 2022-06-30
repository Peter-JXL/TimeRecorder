<template>
  <div id="TRDayAnalyzeBox">
      <div id="echarts"></div>
      <div id="ana"></div>
  </div>
</template>

<script>
export default {
  name: 'TRDayAnalyze'
}
</script>

<style>
  #TRDayAnalyzeBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #echarts,#ana {
    border: 1px solid green;
    width: 500px;
    height: 500px;
  }
</style>