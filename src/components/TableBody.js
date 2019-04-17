import LayoutObserver from './layoutObserver'
export default {
  name: 'TableBody',
  mixins: [LayoutObserver],
  props: {
    store: {
      required: true
    }
  },
  render(h) {
  const columns = this.$parent.store.states.columns
  // const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index))
  const rows = this.data
  return (
      <table cellspacing="0" cellpadding="0" border="0" class="own-table__body">
        <colgroup>
          {
            this._l(columns, column =>
              <col name={ column.id } />
            )
          }
        </colgroup>
        <tbody>
        {
          this._l(rows, (row, $index) => {
            const rowClasses = this.getRowClass(row, $index);
            const tr = (
              <tr
                class={ rowClasses }
              >
              {
                this._l(this.columns, (column, cellIndex) => {
                  const data = {
                    store: this.store,
                    _self: this.context || this.table.$vnode.context,
                    row,
                    column,
                    $index
                  }
                  return (<td class={column.align}>
                    {
                      column.renderCell.call(
                        this._renderProxy,
                        h,
                        data
                      )
                    }
                  </td>)
                })
              }
            </tr>)
            return tr
          })
        }
        </tbody>
      </table>
    )
   },
   methods: {
      clickTr (items) {
        this.$parent.store.commit('handleRowClick', items)
      },
      handleHoverEvent (row) {
        this.$parent.store.commit('handleHoverEvent', row)
      },
      isColumnHidden(index) {
        if (this.fixed === true || this.fixed === 'left') {
          return index >= this.leftFixedLeafCount;
        } else if (this.fixed === 'right') {
          return index < this.columnsCount - this.rightFixedLeafCount;
        } else {
          return (index < this.leftFixedLeafCount) || (index >= this.columnsCount - this.rightFixedLeafCount);
        }
      },
      // 行样式
      getRowClass(row, rowIndex) {
        const classes = []
        const rowClassName = this.table.rowClassName
        if (typeof rowClassName === 'string') {
          classes.push(rowClassName);
        } else if (typeof rowClassName === 'function') {
          classes.push(rowClassName.call(null, {
            row,
            rowIndex
          }))
        }
        return classes
      }
   },
   mounted () {
   },
  computed: {
    columns() {
      return this.store.states.columns
    },
    data() {
      return this.store.states.data
    },
    table () {
      return this.$parent
    }
  }
}
