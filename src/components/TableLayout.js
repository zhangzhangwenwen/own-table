import scrollbarWidth from './utils/scrollbar-width'
import Vue from 'vue'
class TableLayout {
  constructor (options) {
    this.observers = []
    this.showHeader = true
    this.fit = true // 暂时默认设置了自适应
    this.table = null
    this.bodyWidth = null
    this.store = null
    this.scrollY = false // 暂时默认有纵向滚动条
    this.scrollX = false // 暂时默认无横向滚动条
    this.height = null // 表格高度
    this.tableHeight = null
    this.headerHeight = 20 // Table Header Height
    this.bodyHeight = null // Table Height - Table Header Height
    this.gutterWidth = scrollbarWidth()

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }
  }
  // 设置整个表格的高度
  setHeight (value, prop = 'height') {
    if (Vue.prototype.$isServer) return;
    const el = this.table.$el
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = Number(value)
    }
    this.height = value

    if (!el && (value || value === 0)) return Vue.nextTick(() => this.setHeight(value, prop));

    if (typeof value === 'number') {
      el.style[prop] = value + 'px'

      this.updateElsHeight()
    } else if (typeof value === 'string') {
      el.style[prop] = value
      this.updateElsHeight()
    }
  }

  setMaxHeight(value) {
    return this.setHeight(value, 'max-height');
  }

  addObserver(observer) {
    this.observers.push(observer);
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
  // 计算高度
  updateElsHeight() {
    if (!this.table.$ready) return Vue.nextTick(() => this.updateElsHeight())
    // const { headerWrapper, appendWrapper, footerWrapper } = this.table.$refs
    const { headerWrapper } = this.table.$refs
    // this.appendHeight = appendWrapper ? appendWrapper.offsetHeight : 0;

    const headerHeight = this.headerHeight = !this.showHeader ? 0 : headerWrapper.offsetHeight
    // if (this.showHeader && headerWrapper.offsetWidth > 0 && (this.table.columns || []).length > 0 && headerHeight < 2) {
    //   return Vue.nextTick(() => this.updateElsHeight());
    // }
    const tableHeight = this.tableHeight = this.table.$el.clientHeight
    if (this.height !== null && (!isNaN(this.height) || typeof this.height === 'string')) {
      // const footerHeight = this.footerHeight = footerWrapper ? footerWrapper.offsetHeight : 0;
      // this.bodyHeight = tableHeight - headerHeight - footerHeight + (footerWrapper ? 1 : 0)
      
      this.bodyHeight = tableHeight - headerHeight // 表格body的高度是整个table的高度减去表头的高度
    }
    // this.fixedBodyHeight = this.scrollX ? this.bodyHeight - this.gutterWidth : this.bodyHeight;

    // const noData = !this.table.data || this.table.data.length === 0;
    // this.viewportHeight = this.scrollX ? tableHeight - (noData ? 0 : this.gutterWidth) : tableHeight;


    this.updateScrollY();
    this.notifyObservers('scrollable');
  }
  updateScrollY () {
    const height = this.height
    if (typeof height !== 'string' && typeof height !== 'number') return
    const bodyWrapper = this.table.bodyWrapper
    if (this.table.$el && bodyWrapper) {
      const body = bodyWrapper.querySelector('.own-table__body')
      this.scrollY = body.offsetHeight > this.bodyHeight
    }
  }
  // 动态计算宽度
  updateColumnsWidth () {
    const fit = this.fit  // 是否设置属性fit
    const bodyWidth = this.table.$el.clientWidth // 屏幕视图的宽度
    const flattenColumns = this.getFlattenColumns()
    let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number')
    let bodyMinWidth = 0

    flattenColumns.forEach((column) => { // Clean those columns whose width changed from flex to unflex
      if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
    })
    if (flexColumns.length > 0 && fit) { // 有数据的时候
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.width || column.minWidth || 80 // min-width 100 + width 100 + min-width 80 + min-width 80 + width 100
      });
      const scrollYWidth = this.scrollY ? this.gutterWidth : 0 // 记录Y轴滚动条的宽度
      if (bodyMinWidth <= bodyWidth - scrollYWidth) { // DON'T HAVE SCROLL BAR
        this.scrollX = false // 无横向滚动条
                              
        const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth // 需要分配的宽度 = 视图宽度836px(bodyWidth) - Y轴滚动条的宽度8px - 实际表格宽度460(bodyMinWidth)

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth; // 如果只有以后一列数据 需要分配的宽度全部分给第一列
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0) // 所有min-width的宽度
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth // 需要分配的宽度/所有可以去分配是min-width的宽度 算出每个设置了min-width的列具体分配多少px
          
          let noneFirstWidth = 0

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth = (column.minWidth || 80) + flexWidth;
          });

          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      } else { // HAVE HORIZONTAL SCROLL BAR 存在横向滚动条
        this.scrollX = true
        flexColumns.forEach(function(column) {
          column.realWidth = column.minWidth
        });
      }

      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth)
      this.table.resizeState.width = this.bodyWidth
    } else {  // 没有数据的时候
      flattenColumns.forEach((column) => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80;
        } else {
          column.realWidth = column.width || column.minWidth;
        }

        bodyMinWidth += column.realWidth;
      });
      this.scrollX = bodyMinWidth > bodyWidth;

      this.bodyWidth = bodyMinWidth;
    }
    this.notifyObservers('columns')
  }
  notifyObservers(event) {
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