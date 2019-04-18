
import { getPropByPath } from './utils/util';
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


const DEFAULT_RENDER_CELL = function(h, { row, column, $index }) {
  const property = column.property // 类似于name、age
  const value = property && getPropByPath(row, property).v // getPropByPath 取出属性对应的属性值 {'name': '张三'} 返回值为张三
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value;
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

// 选项
const defaults = {
  default: {
    order: ''
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
    className: 'own-table-column--selection'
  }
}
// 几种不同的渲染函数 type=selection
const forced = {
  selection: {
    renderHeader: function(h, { store }) {
      return <input type="checkbox"    //  当这里的标签渲染到tableHeaer组件里面时  this指向的是tableHeader组件
        disabled={ store.states.data && store.states.data.length === 0 }
        value={ this.isAllSelected } 
        onClick={ this.toggleAllSelection}/>
    },
    renderCell: function(h, { row, column, store, $index }) {
      return <input 
      type="checkbox" 
      value={ store.isSelected(row) }
      onInput={ () => { store.commit('rowSelectedChanged', row)} }/>
    },
    sortable: false,
    resizable: false
  }
};
export default {
  name: 'TableColumn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    property: String, // 父级传过来的属性值
    prop: String,
    label: String,
    width: String,
    minWidth: String,
    align: String,
    headerAlign: String,
    sortable: Boolean,
    rowClassName: String
  },
  render () {
  },
  computed: {
    store () {
      return this.$parent.store
    }
  },
  created () {
    this.customRender = this.$options.render;
    this.$options.render = h => h('div', this.$slots.default)
    
    const width = parseWidth(this.width)
    const minWidth = parseMinWidth(this.minWidth)
    let parent = this.columnOrTableParent
    this.columnId = '_column_' + columnIdSeed++
    let type = this.type
    const option = getDefaultColumns({
      id: this.columnId,
      // prop: this.prop,
      label: this.label,
      minWidth,
      width,
      type,
      property: this.prop || this.property,
      renderCell: null,
      sortable: this.sortable || false,
      align: this.align ? 'is-' + this.align : null,
      headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null)
    })

    let source = forced[type] || {} // 找到对应的渲染函数

    Object.keys(source).forEach((prop) => {
      let value = source[prop]
      if (value !== undefined) {
        if (prop === 'renderHeader') {
          if (type === 'selection' && option[prop]) {
            console.warn('[Element Warn][TableColumn]Selection column doesn\'t allow to set render-header function.');
          } else {
            value = option[prop] || value
          }
        }
        option[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
      }
    })

    this.columnConfig = option // 传入参数
    let renderCell = option.renderCell
    let _self = this

    option.renderCell = function(h, data) { // 渲染函数
      if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data);
      }
      
      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL
      }
      const children = [
        _self.renderTreeCell(data),
        renderCell(h, data)
      ]
      return (<div class="cell"> { children }</div>)
    }
  },
  methods: {
    renderTreeCell(data) {
      if (!data.treeNode) return null;
      const ele = [];
      ele.push(<span class="el-table__indent" style={{'padding-left': data.treeNode.indent + 'px'}}></span>);
      if (data.treeNode.hasChildren) {
        ele.push(<div class={ ['el-table__expand-icon', data.treeNode.expanded ? 'el-table__expand-icon--expanded' : '']}
          on-click={this.handleTreeExpandIconClick.bind(this, data)}>
          <i class='el-icon el-icon-arrow-right'></i>
        </div>);
      } else {
        ele.push(<span class="el-table__placeholder"></span>);
      }
      return ele;
    }
  },
  watch: {
    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },
    property(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    }
  },
  mounted () {
    this.store.states.columns.push(this.columnConfig)
  }
}
