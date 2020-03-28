class TableLayout {
    constructor(options) {
        this.fit = true // 暂时默认设置了自适应
        this.scrollY = false // 暂时默认有纵向滚动条
        this.scrollX = false

        for (let name in options) {
            if (options.hasOwnProperty(name)) {
                this[name] = options[name]
            }
        }
    }
    getFlattenColumns() {
        const flattenColumns = [];
        const columns = this.table.store.states.columns;
        columns.forEach((column) => {
            if (column.isColumnGroup) {
                flattenColumns.push.apply(flattenColumns, column.columns);
            } else {
                flattenColumns.push(column);
            }
        });

        return flattenColumns;
    }
    // 更新宽度
    updateColumnsWidth() {
        const fit = this.fit  // 是否设置属性fit
        const bodyWidth = this.table.$el.clientWidth // 屏幕视图的宽度

        const flattenColumns = this.getFlattenColumns()
        let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number') // 去除没有设置width列的去进行宽度分配

        let bodyMinWidth = 0

        flattenColumns.forEach((column) => { // 每次更新前先重置下数据
            if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
        })


        if (flexColumns.length > 0 && fit) { // 有数据的时候
            flattenColumns.forEach((column) => {
                bodyMinWidth += column.width || column.minWidth || 80 // min-width 100 + width 100 + min-width 80 + min-width 80 + width 100
            })
            const scrollYWidth = this.scrollY ? this.gutterWidth : 0 // 记录Y轴滚动条的宽度

            if (bodyMinWidth <= bodyWidth - scrollYWidth) { //没有横向滚动条,多出来一些宽度需要分配到列
                this.scrollX = false
                const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth // 需要分配的宽度 = 视图宽度(bodyWidth) - Y轴滚动条的宽度(scrollYWidth) - 实际表格宽度(bodyMinWidth)




            } else {
                this.scrollX = true
            }





        } else { }
    }
}

export default TableLayout