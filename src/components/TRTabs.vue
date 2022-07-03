<template>
  <el-tabs class="demo-tabs" v-model="activeName">
    <el-tab-pane label="记录时间" name="first">
      <TRRecord></TRRecord>
    </el-tab-pane>


    <el-tab-pane label="当日时间分析" name="second">
      <TRDayAnalyzeVue></TRDayAnalyzeVue>
    </el-tab-pane>


    <el-tab-pane label="数据查询与更新" name="third">
      
    </el-tab-pane>

    
    <el-tab-pane label="标签管理" name="fourth">
      

    </el-tab-pane>

    
    <el-tab-pane label="数据导入导出" name="fifth">
      


    </el-tab-pane>
  </el-tabs>
</template>

<script>
import mousetrap from 'mousetrap'
import TRRecord from './TRRecord.vue'
import TRDayAnalyzeVue from './TRDayAnalyze.vue'
export default {
    name: "TRTabs",
    components: { TRRecord,TRDayAnalyzeVue },
    data() {
      return {
        activeNameArr: ['first',"second","third","fourth","fifth"],
        activeIndex: 0,
        activeName: 'first'
      }
    },
    watch:{
      activeIndex(){
        this.activeName = this.activeNameArr[this.activeIndex]
      }
    },
    mounted(){
      mousetrap.bind('ctrl+tab', ()=>{
        this.activeIndex = this.activeIndex == 4 ? 1 : this.activeIndex+1
      })
    }
}
</script>

<style>

</style>