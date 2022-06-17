<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="记录时间" name="first">
      <TRRecord></TRRecord>
    </el-tab-pane>


    <el-tab-pane label="时间分析" name="second">
      
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
import TRRecord from './TRRecord.vue'

export default {
    name: "TRTabs",
    components: { TRRecord }
}
</script>

<style>

</style>