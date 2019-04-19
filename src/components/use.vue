<template>
    <div class="use-wrapper">
        <OwnTable 
           emptyText="没有数据" 
           :dataSource="dataSource" 
           :max-height="300"
           :row-class-name="rowClassName"
           @selection-change="handleSelectionChange"
           @select="handleSelect"
        >
            <table-column align="center" type="selection" width="55"></table-column>
            <table-column prop="name" label="名字" min-width="200" align="center"></table-column>
            <table-column prop="sex" label="性别" width="100" align="center"></table-column>
            <table-column prop="age" label="年龄" align="center"></table-column>
            <table-column label="体重" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.fat }}</span>
              </template>
            </table-column>
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
        {'name': '张三', 'sex': '男', 'age': '18', 'fat': '20', 'getou': '182'}
      ]
    }
  },
  components: {
    OwnTable,
    TableColumn
  },
  methods: {
    handleSelect (selection, raw) {
      // console.log(selection, raw)
    },
    // 选中项改变
    handleSelectionChange (selection) {
      // console.log(selection)
    },
    rowClassName ({row, rowIndex}) {
        if (rowIndex == 0) {
          return 'first'
        }
    }
  }
}
</script>
