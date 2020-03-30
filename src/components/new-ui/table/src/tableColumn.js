
import { getPropByPath } from './utils/util';
// 获取table数据并对宽度做相关处理
const getDefaultColumns = function (options) {
    const column = {}
    for (let name in options) {
        column[name] = options[name]
    }
    if (!column.minWidth) { // 如果没有最小高度 设置默认值为80
        column.minWidth = 80
    }
    // 真实高度 = width存在吗 存在取改宽度 否则取最小高度
    column.realWidth = column.width === undefined ? column.minWidth : column.width
    return column
}

// 处理width
const parseWidth = (width) => {
    if (width !== undefined) {
        width = parseInt(width, 10)
        if (isNaN(width)) {
            width = null
        }
    }
    return width
}

// 处理minwidth 
const parseMinWidth = (minWidth) => {
    if (minWidth !== undefined) {
        minWidth = parseInt(minWidth, 10)
        if (isNaN(minWidth)) {
            minWidth = 80 // 默认80
        }
    }
    return minWidth
}


// 几种不同的渲染函数 type=selection
const forced = {
    selection: { // 目前只有selection
        renderHeader: function (h, { store }) {
            return <div>ads</div>
            return <input type="checkbox"    //  当这里的标签渲染到tableHeaer组件里面时  this指向的是tableHeader组件
                disabled={store.states.data && store.states.data.length === 0}
                value={this.isAllSelected}
                checked={this.isAllSelected}
                onClick={this.toggleAllSelection} />
        },
        renderCell: function (h, { row, column, store, $index }) {
            return <div>ads</div>
            return <input
                type="checkbox"
                onClick={(event) => event.stopPropagation()}
                value={store.isSelected(row)}
                checked={store.isSelected(row)}
                onInput={() => { store.commit('rowSelectedChanged', row) }} />
        },
        sortable: false,
        resizable: false
    }
};


const DEFAULT_RENDER_CELL = function (h, { row, column, $index }) {
    const property = column.property // 类似于name、age
    const value = property && getPropByPath(row, property).v // getPropByPath 取出属性对应的属性值 {'name': '张三'} 返回值为张三
    if (column && column.formatter) {
        return column.formatter(row, column, value, $index);
    }
    return value;
}

let columnIdSeed = 1

export default {
    name: 'TableColumn',
    data() {
        return {

        }
    },
    render() { },
    props: {
        type: {
            type: String,
            default: 'default'
        },
        property: String, // 父级传过来的属性值
        prop: String,
        label: String,
        width: String,
        minWidth: String,
        align: String,
        headerAlign: String,
        sortable: Boolean,
        rowClassName: String
    },
    computed: {
        store() {
            return this.$parent.store
        }
    },
    created() {
        this.customRender = this.$options.render; // 获取自定义参数
        this.$options.render = h => h('div', this.$slots.default)

        // 宽度参数处理
        const width = parseWidth(this.width)
        const minWidth = parseMinWidth(this.minWidth)

        this.columnId = '_column_' + columnIdSeed++
        let type = this.type // 传过来的type

        // 组件传过来的参数处理
        let column = getDefaultColumns({
            id: this.columnId,
            // prop: this.prop,
            label: this.label,
            minWidth,
            width,
            type,
            property: this.prop || this.property,
            renderCell: null,
            sortable: this.sortable || false,
            align: this.align ? 'is-' + this.align : null,
            headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null)
        })

        let source = forced[type] || {} // 找到对应的渲染函数
        Object.keys(source).forEach((prop) => {
            let value = source[prop]
            if (value !== undefined) {
                if (prop === 'renderHeader') {
                    if (type === 'selection' && column[prop]) {
                        console.warn('[Element Warn][TableColumn]Selection column doesn\'t allow to set render-header function.');
                    } else {
                        value = column[prop] || value
                    }
                }
                column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
            }
        })

        this.columnConfig = column;

        let renderCell = column.renderCell
        let _self = this

        column.renderCell = function (h, data) { // 渲染函数
            if (_self.$scopedSlots.default) { // 先判断有没有<template slot-scope="scope"></template>这个模版
                renderCell = () => _self.$scopedSlots.default(data);
            }

            if (!renderCell) { // 如果没有模版则使用默认的渲染函数
                renderCell = DEFAULT_RENDER_CELL
            }
            const children = [
                _self.renderTreeCell(data),
                renderCell(h, data)
            ]
            return (<div class="cell"> {children}</div>)
        }
    },
    methods: {
        renderTreeCell(data) {
            return null
        }
    },
    mounted() {
        this.store.states.columns.push(this.columnConfig)
    }
}