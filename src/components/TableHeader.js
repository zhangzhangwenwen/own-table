
import LayoutObserver from './layoutObserver'
export default {
  name: 'TableHeader',
  mixins: [LayoutObserver],
  render () {
    const columns = this.$parent.store.states.columns
    return (
      <table cellspacing="0" cellpadding="0" border="0">
        <colgroup>
          {
            this._l(columns, column =>
              <col name={ column.id } />
            )
          }
          {
            this.hasGutter ? <col name="gutter" /> : ''
          }
        </colgroup>
        <thead>
          <tr class='theadStyle'>
            {
              this._l(columns, (column, cellIndex) =>
                <th class={'theadTd'}>
                  {
                    column.renderHeader
                    ? column.renderHeader.call(this._renderProxy, h, { column, $index: cellIndex, store: this.store, _self: this.$parent.$vnode.context })
                    : column.label
                  }
                  { column.sortable ? <span><i on-click={() => this.sortUp(column)} class={'triangle_up'} />
                    <i on-click={() => this.sortDown(column)} class={'triangle_down'} /></span> : ''
                  }
                </th>
              )
            }
            {
              this.hasGutter ? <th class="gutter"></th> : ''
            }
          </tr>
        </thead>
      </table>
    )
  },
  methods: {
    // 表头的复选框状态改变
    toggleAllSelection(event) {
      event.stopPropagation()
      this.store.commit('toggleAllSelection')
    },
    sortDown (item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return b[keyVal] - a[keyVal]
      })
    },
    sortUp (item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return a[keyVal] - b[keyVal]
      })
    }
  },
  mounted () {
  },
  props: {
    store: {
      required: true
    }
  },
  computed: {
    // 去状态管理里面的数据
    isAllSelected() {
      return this.store.states.isAllSelected
    },
    hasGutter() {
      return this.tableLayout.gutterWidth
    },
    table() {
      return this.$parent
    }
  }
}