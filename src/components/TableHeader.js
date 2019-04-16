// import './TableHeader.css'
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
              this._l(columns, (column, index) =>
                <th class={'theadTd'}>
                  { column.label }
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
  computed: {
    hasGutter() {
      return this.tableLayout.gutterWidth
    },
    table() {
      return this.$parent
    }
  }
}