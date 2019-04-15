import LayoutObserver from './layoutObserver';
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
        <table cellspacing="0" cellpadding="0" border="0">
          <colgroup>
            {
              this._l(columns, column =>
                <col name={ column.id } />
              )
            }
          </colgroup>
          {
            dataSource.length > 0 
            ? this._l(dataSource, item =>
              <tr>
                {
                  this._l(attributeObjectArr, option =>
                    <td class={option['align']}>{item[option['prop']]}</td>
                  )
                }
              </tr>
            ) : <tr>{ this.$parent.emptyText }</tr>
            // dataSource.length > 0
            // // 数组的遍历以及数组下面对象的遍历
            // ? this._l(dataSource, item =>
            //   <tr on-click={() => this.clickTr(item)}
            //     on-mouseover={() => this.handleHoverEvent(item)}>
            //     {
            //       this._l(options, option =>
            //         <td>{item[option]}</td>
            //       )
            //     }
            //   </tr>
            // ) : <tr>{ this.$parent.emptyText }</tr>
          }
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
    table() {
      return this.$parent
    }
  }
}