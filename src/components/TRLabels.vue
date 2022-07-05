<template>
  <div></div>
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
      DbUtils.getAllLabel().then((rows)=>{
        rows.forEach( row => {
          this.allLabels.push(row)
        })
      })
    }
  },
  mounted() {
    this.loadLabelsData()
  }
}
</script>

<style>

</style>