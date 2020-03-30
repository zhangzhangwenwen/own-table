import LayoutObserver from './layoutObserver'
export default {
    name: 'TableBody',
    mixins: [LayoutObserver],
    props: {
        store: {
            required: true
        }
    },
    render() {
        const columns = this.$parent.store.states.columns // 列数
        const rows = this.data // 数据的行数
        return (
            <table cellspacing="0" cellpadding="0" border="0" class="own-table__body">
                <colgroup>
                    {
                        this._l(columns, column =>
                            <col name={column.id} />
                        )
                    }
                </colgroup>
                <tbody>
                    {
                        this._l(rows, (row, $index) => { // 先渲染每一行数据
                            // const rowClasses = this.getRowClass(row, $index);
                            const tr = (
                                <tr
                                // class={rowClasses}
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
    computed: {
        table() {
            return this.$parent;
        },
        columns() {
            return this.store.states.columns
        },
        data() {
            return this.store.states.data
        }
    }

}