<template>
   <div id="TRLabelsMain">
      <el-table 
      id="recordTable"
      :data="allLabels" stripe border height="560" max-height="2000" 
      :header-cell-style="{'text-align': 'center'}"
      :cell-style="{'text-align':'center'}"
      :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="firstLabel" label="一级标签" width="120" sortable/>
        <el-table-column prop="secondLabel" label="二级标签" width="120" sortable/>
        <el-table-column prop="timeNote" label="备注" width="500" />
        <el-table-column label="操作" width="100" >
          <template #default="scope">
              <el-button size="small" @click="deleteOneLabel(scope.row.ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import DbUtils from '@/data/DbUtils'

export default {
  name: 'TRLabels',
  data() {
    return {
      allLabels:[]
    }
  },
  methods: {
    loadLabelsData(){
      this.allLabels = this.allLabels.splice(0, 0)

      DbUtils.getAllLabel().then((rows)=>{
        rows.forEach( row => {
          this.allLabels.push(row)
        })
      })
    },
    deleteOneLabel(ID){
      DbUtils.deleteOneLabel(ID).then(()=>{
        this.loadLabelsData()
      })
    }
  },
  mounted() {
    this.loadLabelsData()
  }
}
</script>

<style scoped>
  #TRLabelsMain{
    display: flex;
    justify-content: flex-start;
    align-items: space-between;
    width: 1200px;
    height: 580px;
    border: 1px green;
  }
</style>