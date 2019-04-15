const getDefaultColumns = function (options) {
    const column = {}
    for (let name in options) {
      column[name] = options[name]
    }
    
    if (!column.minWidth) {
      column.minWidth = 80;
    }
  
    column.realWidth = column.width === undefined ? column.minWidth : column.width;
    return column
  }

const parseWidth = (width) => {
  if (width !== undefined) {
    width = parseInt(width, 10);
    if (isNaN(width)) {
      width = null;
    }
  }
  return width;
}

const parseMinWidth = (minWidth) => {
  if (minWidth !== undefined) {
    minWidth = parseInt(minWidth, 10);
    if (isNaN(minWidth)) {
      minWidth = 80;
    }
  }
  return minWidth;
}

let columnIdSeed = 1;
  export default {
    name: 'TableColumn',
    props: {
      prop: String,
      label: String,
      width: String,
      minWidth: String,
      align: String,
      headerAlign: String,
      sortable: Boolean,
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
      let parent = this.columnOrTableParent;
      this.columnId = '_column_' + columnIdSeed++;
      const option = getDefaultColumns({
        id: this.columnId,
        prop: this.prop,
        label: this.label,
        minWidth,
        width,
        sortable: this.sortable || false,
        align: this.align ? 'is-' + this.align : null,
        headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null),
      })
      this.columnConfig = option // 传入参数
    },
    mounted () {
      this.store.states.columns.push(this.columnConfig)
    }
  }