import LayoutObserver from './layoutObserver';


export default {
    name: 'TableHeader',
    mixins: [LayoutObserver],
    render() {
        const columns = this.$parent.store.states.columns
        return (
            <table cellspacing="0" cellpadding="0" border="0">
                <colgroup>
                    {
                        this._l(columns, column =>
                            <col name={column.id} />
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
                                    {column.sortable ? <span><i on-click={() => this.sortUp(column)} class={'triangle_up'} />
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
    computed: {
        table() {
            return this.$parent;
        }
    }
}