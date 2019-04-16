<template>
    <div class="use-wrapper">
        <OwnTable emptyText="没有数据" :dataSource="dataSource" :max-height="300">
            <table-column prop="name" label="名字" min-width="200" align="center"></table-column>
            <table-column prop="sex" label="性别" width="100" align="center"></table-column>
            <table-column prop="age" label="年龄" align="center"></table-column>
            <table-column prop="fat" label="体重" align="center"></table-column>
            <table-column prop="getou" label="个头" width="100" align="center"></table-column>
            <table-column prop="getou" label="个头" width="100" align="center"></table-column>
            <table-column prop="getou" label="个头" width="100" align="center"></table-column>
            <table-column prop="getou" label="个头" width="100" align="center"></table-column>
            <table-column prop="getou" label="个头" width="100" align="center"></table-column>
        </OwnTable>
    </div>
</template>

<script>
import OwnTable from './OwnTable'
import TableColumn from './TableColumn'
export default {
  data () {
    return {
      dataSource: [
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'},
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'}
      ]
    }
  },
  components: {
    OwnTable,
    TableColumn
  }
}
</script>
