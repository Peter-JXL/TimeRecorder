<template>
  <el-row :gutter="20">
    <el-col :span="10">
      <el-table :data="tableData">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </el-col>

    <el-col :span="10">
      <el-calendar v-model="value" />
      <el-row>
        开始时间：
        <el-time-picker
          v-model="beginTime"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
          placeholder="Arbitrary time"
        />
      </el-row>

      <el-row>
        结束时间：
        <el-time-picker
          v-model="endTime"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
          placeholder="Arbitrary time"
        />
      </el-row>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: "TRRecord",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
      beginTime: '',        //用户输入的开始时间
      endTime: '',          //用户输入的结束时间
      firstLabelChoose: '', //用户选择的一级标签
      secondLabelChoose: '', //用户选择的二级标签
      fisrtLabels: [],      //标签表里的所有一级标签，用于填充下拉框
      secondLabels: []      //标签表里所有的二级标签，用于填充下拉框
    };
  },
};
</script>

<style scoped>
el-calendar {
  width: 70%;
}
</style>