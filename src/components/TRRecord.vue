<template>
  <el-row :gutter="20">
    <el-col :span="10">
      <el-table :data="tableData" stripe border height="500" max-height="2000">
        <el-table-column prop="date" label="开始时间" width="100" />
        <el-table-column prop="name" label="结束时间" width="100" />
        <el-table-column prop="name" label="一级标签" width="100" />
        <el-table-column prop="name" label="二级标签" width="100" />
        <el-table-column prop="name" label="备注" width="100" />
      </el-table>
    </el-col>

    <el-col :span="10">
      <el-calendar v-model="caldayChoose" />

      <div id="button">
        <el-button @click="skip('preYear')" type="primary" round size="small"><i class="el-icon-arrow-left"></i>年</el-button>
        <el-button @click="skip('preMonth')" type="warning" round size="small"><i class="el-icon-arrow-left"></i>月</el-button>
        <el-button @click="skip('preDay')" type="success" round size="small"><i class="el-icon-arrow-left"></i>日</el-button>
        <el-button @click="skip('today')" type="info" round size="small">今天</el-button>
        <el-button @click="skip('postDay')" type="success" round size="small">日<i class="el-icon-arrow-right"></i></el-button>
        <el-button @click="skip('postMonth')" type="warning" round size="small">月<i class="el-icon-arrow-right"></i></el-button>
        <el-button @click="skip('postYear')" type="primary" round size="small">年<i class="el-icon-arrow-right"></i></el-button>
      </div>

      <el-row> 开始时间： <el-time-picker v-model="beginTime" format="HH:mm" /></el-row>
      <el-row> 结束时间：<el-time-picker v-model="endTime" format="HH:mm" /></el-row>

      <el-row>
        一级标签：
        <el-select v-model="firstLabelChoose" class="m-2" size="large">
          <el-option
            v-for="item in fisrtLabels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>

      <el-row>
        二级标签：
        <el-select v-model="secondLabelChoose" class="m-2" size="large">
          <el-option
            v-for="item in secondLabels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>

      <el-row><el-col :span="20"> 备注：<el-input v-model="timeNote" /> </el-col></el-row>

      <el-row>
        <el-button type="primary">添加</el-button>
        <el-button type="primary">复制当日记录到Excel表格</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import DbUtils from '@/data/DbUtils';


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
      caldayChoose: new Date(),
      beginTime: "", //用户输入的开始时间
      endTime: "", //用户输入的结束时间
      firstLabelChoose: "", //用户选择的一级标签
      secondLabelChoose: "", //用户选择的二级标签
      timeNote: "", // 用户输入的时间备注
      fisrtLabels: [
        {
          label: "睡眠",
          value: "睡眠",
        },
      ], //标签表里的所有一级标签，用于填充下拉框
      secondLabels: [
        {
          label: "午睡",
          value: "午睡",
        },
      ], //标签表里所有的二级标签，用于填充下拉框
    };
  },
  watch: {
    caldayChoose(){
        this.loadDayTime()
    }
  },    
  methods: {
    loadDayTime(){
      var data = DbUtils.returnOneDayData(this.caldayChoose)
    },
    loadLabels(){
      var data = DbUtils.getLabelTableData()
      console.log('loadLabels',data)
    },
    skip(flag) {
      if (flag === 'preYear') this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() - 1));
      else if (flag === 'preMonth') this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() - 1));
      else if (flag === 'preDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() - 1));
      else if (flag === 'today') this.caldayChoose = new Date();
      else if (flag === 'postDay') this.caldayChoose = new Date(this.caldayChoose.setDate(this.caldayChoose.getDate() + 1));
      else if (flag === 'postMonth') this.caldayChoose = new Date(this.caldayChoose.setMonth(this.caldayChoose.getMonth() + 1));
      else if (flag === 'postYear') this.caldayChoose = new Date(this.caldayChoose.setFullYear(this.caldayChoose.getFullYear() + 1));
    },
  },
  mounted() {
    this.caldayChoose = new Date()
    this.loadDayTime()
    this.loadLabels()    
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-calendar__header {
  // 修改头部背景颜色
  background-color: #57617c;
  padding: 3px 5px;
  border: none;
  display: flex;
  justify-content: center;

  .el-calendar__button-group {
    // 隐藏原生按钮
    display: none;
  }

  .el-calendar__title {
    // 修改头部标题的字体颜色
    color: white !important;
    font-size: 18px;
    font-weight: bolder;
  }
}

::v-deep .el-calendar__body {
  // 修改主题部分
  padding: 0;
}

::v-deep .el-calendar-table {
  thead {
    th {
      // 修改头部星期部分
      padding: 0;
      background-color: #57617c;
      color: white;
    }
  }

  .is-selected {
    .el-calendar-day {
      p {
        // 选中日期颜色
        color: black;
      }
    }
  }

  .el-calendar-day {
    // 每天小块样式设置
    padding: 0;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      // 所有日期颜色
      color: black;
      z-index: 1;
      user-select: none;
      display: flex;
    }
  }
}

::v-deep .el-calendar-table__row {
  .prev,
  .next {
    // 修改非本月
    .el-calendar-day {
      p {
        color: #f0d9d5;
      }
    }
  }

  td {
    // 修改每一个日期td标签
    &:first-child,
    &:last-child {
      background-color: #f5f5f5;
    }
  }
}
</style>