import LayoutObserver from './layoutObserver'
export default {
  name: 'TableBody',
  mixins: [LayoutObserver],
  render(h) {
    const columns = this.$parent.store.states.columns
    let attributeObjectArr = []
    columns.map(function (column) {
      attributeObjectArr.push({align: column['align'], prop: column['prop']})
  })
  const dataSource = this.$parent.dataSource
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
          this._l(dataSource, item =>
            <tr>
              {
                this._l(attributeObjectArr, option =>
                  <td class={option['align']}>{item[option['prop']]}</td>
                )
              }
            </tr>
          )
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
      }
   },
   mounted () {
   },
  computed: {
    table () {
      return this.$parent
    }
  }
}
