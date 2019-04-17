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
    let attributeObjectArr = []
    columns.map(function (column) {
      attributeObjectArr.push({align: column['align'], prop: column['prop']})
  })
  // const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index))
  // const dataSource = this.$parent.dataSource
  const rows = this.data
  return (
      <table 
        cellspacing="0" 
        cellpadding="0" 
        border="0" 
        class="own-table__body"
        >
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
            const tr = (<tr>
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
