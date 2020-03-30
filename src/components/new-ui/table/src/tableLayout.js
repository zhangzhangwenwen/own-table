
import Vue from 'vue'
class TableLayout {
    constructor(options) {
        this.fit = true // 暂时默认设置了自适应
        this.observers = [];
        this.showHeader = true;

        this.scrollY = false // 暂时默认有纵向滚动条
        this.scrollX = false
        this.appendHeight = 0; // Append Slot Height
        this.headerHeight = 44; // 表头的高度
        this.tableHeight = null;
        this.height = null;
        this.bodyWidth = null;
        this.footerHeight = 44; // 如果有总结, 那就是那一行的高度
        this.viewportHeight = null; // Table Height - Scroll Bar Height
        this.bodyHeight = null; // Table Height - Table Header Height
        this.fixedBodyHeight = null; // Table Height - Table Header Height - Scroll Bar Height

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
    // 更新高度
    updateElsHeight() {
        if (!this.table.$ready) return Vue.nextTick(() => this.updateElsHeight())
        const { headerWrapper, appendWrapper, footerWrapper } = this.table.$refs;

        // this.appendHeight = appendWrapper ? appendWrapper.offsetHeight : 0;
        if (this.showHeader && !headerWrapper) return; // 如果没有加载完表头或者不展示头部，直接返回不往下执行
        const headerHeight = this.headerHeight = !this.showHeader ? 0 : headerWrapper.offsetHeight;

        if (this.showHeader && headerWrapper.offsetWidth > 0 && (this.table.columns || []).length > 0 && headerHeight < 2) {
            return Vue.nextTick(() => this.updateElsHeight());
        }
        const tableHeight = this.tableHeight = this.table.$el.clientHeight;

        if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
            const footerHeight = this.footerHeight = footerWrapper ? footerWrapper.offsetHeight : 0;
            this.bodyHeight = tableHeight - headerHeight - footerHeight + (footerWrapper ? 1 : 0); // 表格body的高度
        }
        this.fixedBodyHeight = this.scrollX ? this.bodyHeight - this.gutterWidth : this.bodyHeight;

        const noData = !this.table.data || this.table.data.length === 0;
        this.viewportHeight = this.scrollX ? tableHeight - (noData ? 0 : this.gutterWidth) : tableHeight;

        this.updateScrollY();
        this.notifyObservers('scrollable');
    }

    updateScrollY() {
        const height = this.height;
        if (typeof height !== 'string' && typeof height !== 'number') return;
        const bodyWrapper = this.table.bodyWrapper;
        if (this.table.$el && bodyWrapper) {
            const body = bodyWrapper.querySelector('.el-table__body');
            this.scrollY = body.offsetHeight > this.bodyHeight;
        }
    }
    // 更新宽度
    updateColumnsWidth() {
        const fit = this.fit  // 是否设置属性fit
        const bodyWidth = this.table.$el.clientWidth // 屏幕视图的宽度

        const flattenColumns = this.getFlattenColumns()
        let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number') // 过滤出没有设置width列的去进行宽度分配

        let bodyMinWidth = 0

        flattenColumns.forEach((column) => { // 每次更新前先重置下数据
            if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
        })

        if (flexColumns.length > 0 && fit) { // 存在未设置宽度的列
            flattenColumns.forEach((column) => {
                bodyMinWidth += column.width || column.minWidth || 80 // min-width 100 + width 100 + min-width 80 + min-width 80 + width 100
            })
            const scrollYWidth = this.scrollY ? this.gutterWidth : 0 // 记录Y轴滚动条的宽度

            if (bodyMinWidth <= bodyWidth - scrollYWidth) { //没有横向滚动条,多出来一些宽度需要分配到列
                this.scrollX = false
                const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth // 需要分配的宽度 = 视图宽度(bodyWidth) - Y轴滚动条的宽度(scrollYWidth) - 实际表格宽度(bodyMinWidth)

                if (flexColumns.length === 1) { // 若只有一列没有设置宽度，则将所有的宽度都分配给该列
                    flexColumns[0].realWidth = (flexColumns.minWidth || 80) + totalFlexWidth
                } else {

                    const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0) // 计算所有未设置宽度的列的总宽度

                    const flexWidthPerPixel = totalFlexWidth / allColumnsWidth; // 需要分配的宽度/所有未分配的列的总宽度 = 计算出每一列分配的比例
                    let noneFirstWidth = 0;

                    flexColumns.forEach((column, index) => {
                        if (index === 0) return; // 第一列暂时不分配
                        const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
                        noneFirstWidth += flexWidth;
                        column.realWidth = (column.minWidth || 80) + flexWidth;
                    });
                    flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth; // 最后将需要分配的宽度 - 除了第一列以外的所有宽度和赋值给第一列
                }

            } else { // 存在横向滚动条
                this.scrollX = true
                flexColumns.forEach(function (column) {
                    column.realWidth = column.minWidth;
                })
            }

            this.bodyWidth = Math.max(bodyMinWidth, bodyWidth) // bodyWidth就是表格tablebody的宽度 不是屏幕试图的宽度
            this.table.resizeState.width = this.bodyWidth;
        } else {  // 不存在未设置宽度的列
            flattenColumns.forEach((column) => {
                if (!column.width && !column.minWidth) {
                    column.realWidth = 80;
                } else {
                    column.realWidth = column.width || column.minWidth;
                }

                bodyMinWidth += column.realWidth;
            });
            this.scrollX = bodyMinWidth > bodyWidth; // 最开始的时候bodyWidth就是屏幕视图的宽度， 进入这个判断则不会修改bodyWidth， 所以可以判断是否出现x滚动条

            this.bodyWidth = bodyMinWidth;

        }

        this.notifyObservers('columns'); // 添加监听
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    notifyObservers(event) {  // 监听列变换事件
        const observers = this.observers;
        observers.forEach((observer) => {
            switch (event) {
                case 'columns':
                    observer.onColumnsChange(this);
                    break;
                case 'scrollable':
                    observer.onScrollableChange(this);
                    break;
                default:
                    throw new Error(`Table Layout don't have event ${event}.`);
            }
        });
    }
}

export default TableLayout