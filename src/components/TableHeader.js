// import './TableHeader.css'
import LayoutObserver from './layoutObserver';
export default {
  name: 'TableHeader',
  mixins: [LayoutObserver],  
  render () {
    const columns = this.$parent.store.states.columns
    return (
       <table>
        <colgroup>
          {
            this._l(columns, column =>
              <col name={ column.id } />
            )
          }
          {
            <col width="8"/>
          }
        </colgroup>
          <thead>
            <tr class='theadStyle'>
              {
                this._l(columns, (column, index) =>
                  <th class={'theadTd'}>
                    { column.label }
                    { column.sortable
                        ? <span>
                          <i on-click={() => this.sortUp(column)} class={'triangle_up'} />
                          <i on-click={() => this.sortDown(column)} class={'triangle_down'} />
                        </span> : ''
                    }
                  </th>
                )
              }
              {
                <th></th>
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
  computed: {
    table() {
      return this.$parent
    }
  }
}