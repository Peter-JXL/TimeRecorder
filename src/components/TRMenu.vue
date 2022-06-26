<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
  >
    <el-menu-item index="1">文件</el-menu-item>

    <el-sub-menu index="3">
      <template #title>主题</template>
      <el-menu-item index="3-1">浅色</el-menu-item>
      <el-menu-item index="3-2">深色</el-menu-item>
      <el-menu-item index="3-3">自动更换</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="4">
      <template #title>帮助</template>
      <el-menu-item index="4-1">快速开始</el-menu-item>
      <el-menu-item index="4-2">鸣谢</el-menu-item>
      <el-menu-item index="4-3">隐私条款</el-menu-item>
      <el-menu-item index="4-4">网站</el-menu-item>
      <el-menu-item index="4-5">反馈</el-menu-item>
      <el-divider></el-divider>
      <el-menu-item index="4-6">检查更新</el-menu-item>
      <el-menu-item index="4-7">关于</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {
  name: "TRMenu",
  data() {
    return {};
  },
};
</script>

<style>
</style>