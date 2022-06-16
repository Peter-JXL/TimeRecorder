<template>
  <div  class="common-layout"> 
    <el-container>
      <el-header>
        <TRMenu></TRMenu>
      </el-header>


      <el_main>
        <TRTabs></TRTabs>
      </el_main>

      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
import TRMenu from './components/TRMenu.vue';
import TRTabs from './components/TRTabs.vue';

export default {
  name: "App",
  components: { TRMenu,TRTabs },
};
</script>

<style>
</style>
