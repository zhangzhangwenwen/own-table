// 获取table数据并对宽度做相关处理
const getDefaultColumns = function (options) {
  const column = {}
  for (let name in options) {
    column[name] = options[name]
  }
  if (!column.minWidth) { // 如果没有最小高度 设置默认值为80
    column.minWidth = 80
  }
  // 猎德真实高度 = width存在吗 存在取改宽度 否则取最小高度
  column.realWidth = column.width === undefined ? column.minWidth : column.width
  return column
}

const parseWidth = (width) => {
  if (width !== undefined) {
    width = parseInt(width, 10)
    if (isNaN(width)) {
      width = null
    }
  }
  return width
}

const parseMinWidth = (minWidth) => {
  if (minWidth !== undefined) {
    minWidth = parseInt(minWidth, 10)
    if (isNaN(minWidth)) {
      minWidth = 80
    }
  }
  return minWidth
}

let columnIdSeed = 1
export default {
  name: 'TableColumn',
  props: {
    prop: String,
    label: String,
    width: String,
    minWidth: String,
    align: String,
    headerAlign: String,
    sortable: Boolean
  },
  render () {
  },
  computed: {
    store () {
      return this.$parent.store
    }
  },
  created () {
    const width = parseWidth(this.width)
    const minWidth = parseMinWidth(this.minWidth)
    let parent = this.columnOrTableParent
    this.columnId = '_column_' + columnIdSeed++
    const option = getDefaultColumns({
      id: this.columnId,
      prop: this.prop,
      label: this.label,
      minWidth,
      width,
      sortable: this.sortable || false,
      align: this.align ? 'is-' + this.align : null,
      headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null)
    })
    this.columnConfig = option // 传入参数
  },
  mounted () {
    this.store.states.columns.push(this.columnConfig)
  }
}
