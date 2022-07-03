<template>
  <div  class="common-layout"> 
    <el-container>

      <el-main>
        <TRTabs></TRTabs>
      </el-main>

      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
import TRTabs from './components/TRTabs.vue';

export default {
  name: "App",
  components: { TRTabs },
};
</script>

<style>
</style>
