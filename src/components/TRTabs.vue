<template>
  <el-tabs class="demo-tabs" v-model="activeName">
    <el-tab-pane label="记录时间" name="first">
      <TRRecord></TRRecord>
    </el-tab-pane>


    <el-tab-pane label="当日时间分析" name="second">
      <TRDayAnalyzeVue></TRDayAnalyzeVue>
    </el-tab-pane>

    
    <el-tab-pane label="标签管理" name="third">
      <TRLabels></TRLabels>
    </el-tab-pane>

    
    <el-tab-pane label="数据统计" name="fourth">
    

    </el-tab-pane>
  </el-tabs>
</template>

<script>
import mousetrap from 'mousetrap'
import TRRecord from './TRRecord.vue'
import TRDayAnalyzeVue from './TRDayAnalyze.vue'
import TRLabels from './TRLabels.vue'
export default {
    name: "TRTabs",
    components: { TRRecord, TRDayAnalyzeVue, TRLabels },
    data() {
      return {
        activeNameArr: ['first',"second","third","fourth"],  //当前标签页的name集合
        activeIndex: 0,  //当前激活的标签页下标
        activeName: 'first'  //绑定Tabs组件的激活标签
      }
    },
    watch:{
      //当activeIndex变化时，切换Tabs组件的标签页
      activeIndex(){
        this.activeName = this.activeNameArr[this.activeIndex]
      }
    },
    mounted(){
      //绑定ctrl+tab快捷键切换Tab 
      mousetrap.bind('绑定ctrl+tab快捷键', ()=>{
        this.activeIndex = (this.activeIndex === this.activeNameArr.length -1)  ? 0 : this.activeIndex+1
      })
    }
}
</script>

<style>

</style>