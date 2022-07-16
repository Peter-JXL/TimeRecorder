<template>
  <el-tabs class="demo-tabs" v-model="activeName">
    <el-tab-pane label="记录时间" name="first">
      <TRRecord/>
    </el-tab-pane>


    <el-tab-pane label="当日时间分析" name="second">
      <TRDayAnalyzeVue/>
    </el-tab-pane>

    
    <el-tab-pane label="标签管理" name="third">
      <TRLabels/>
    </el-tab-pane>

    
    <el-tab-pane label="数据统计" name="fourth">
      <TRDaysAnalyze/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import mousetrap from 'mousetrap'
import TRRecord from './TRRecord.vue'
import TRDayAnalyzeVue from './TRDayAnalyze.vue'
import TRLabels from './TRLabels.vue'
import TRDaysAnalyze from './TRDaysAnalyze.vue'

export default {
    name: "TRTabs",
    components: { TRRecord, TRDayAnalyzeVue, TRLabels, TRDaysAnalyze },
    data() {
      return {
        activeNameArr: ['first',"second","third","fourth"],  //当前标签页的name集合
        activeIndex: 0,  //当前激活的标签页下标
        activeName: 'first'  //绑定Tabs组件的激活标签
      }
    },
    watch:{
      //当activeIndex变化时，切换为对应的Tabs组件的标签页
      activeIndex(){
        this.activeName = this.activeNameArr[this.activeIndex]
      }
    },
    mounted(){
      //绑定ctrl+tab快捷键切换Tab 
      mousetrap.bind('ctrl+tab', ()=>{
        this.activeIndex = (this.activeIndex === this.activeNameArr.length -1)  ? 0 : this.activeIndex+1
      })
       mousetrap.bind('ctrl+shift+tab', ()=>{
        this.activeIndex = (this.activeIndex === 0)  ? this.activeNameArr.length - 1 : this.activeIndex-1
      })
    }
}
</script>

<style>

</style>