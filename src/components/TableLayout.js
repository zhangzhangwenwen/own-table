import scrollbarWidth from './utils/scrollbar-width'
class TableLayout {
  constructor (options) {
    this.observers = []
    this.fit = true // 暂时默认设置了自适应
    this.table = null
    this.bodyWidth = null
    this.store = null
    this.scrollY = true // 暂时默认有纵向滚动条
    this.scrollX = false // 暂时默认无横向滚动条
    this.gutterWidth = scrollbarWidth()

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }
  }
  setHeight (value) {
    const el = this.table.$el.querySelector('.tableBody')
    if (typeof value === 'number') {
      el.style['height'] = value + 'px'
      this.updateElsHeight()
    } else if (typeof value === 'string') {
      el.style['height'] = ''
      this.updateElsHeight()
    }
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
  // 动态计算高度
  updateElsHeight() {
    // this.updateScrollY();
    // this.notifyObservers('scrollable');
  }  
  // 动态计算宽度
  updateColumnsWidth () {
    const fit = this.fit  // 是否设置属性fit
    const bodyWidth = this.table.$el.clientWidth // 屏幕视图的宽度
    const flattenColumns = this.getFlattenColumns();
    let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number');
    let bodyMinWidth = 0

    flattenColumns.forEach((column) => { // Clean those columns whose width changed from flex to unflex
      if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
    })
    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.width || column.minWidth || 80; // min-width 100 + width 100 + min-width 80 + min-width 80 + width 100
      });
      const scrollYWidth = this.scrollY ? this.gutterWidth : 0; // 记录Y轴滚动条的宽度
      if (bodyMinWidth <= bodyWidth - scrollYWidth) { // DON'T HAVE SCROLL BAR
        this.scrollX = false; // 无横向滚动条
                              
        const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth; // 需要分配的宽度 = 视图宽度836px(bodyWidth) - Y轴滚动条的宽度8px - 实际表格宽度460(bodyMinWidth)

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth; // 如果只有以后一列数据 需要分配的宽度全部分给第一列
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0); // 所有min-width的宽度
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth; // 需要分配的宽度/所有可以去分配是min-width的宽度 算出每个设置了min-width的列具体分配多少px
          
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth = (column.minWidth || 80) + flexWidth;
          });

          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      } else { // HAVE HORIZONTAL SCROLL BAR 存在横向滚动条
        this.scrollX = true;
        flexColumns.forEach(function(column) {
          column.realWidth = column.minWidth;
        });
      }

      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
      this.table.resizeState.width = this.bodyWidth;
    } else {
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
    this.notifyObservers('columns');
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