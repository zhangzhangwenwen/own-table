class TableLayout {
    constructor (options) {
      this.observers = []
      this.fit = true
      this.table = null
      this.bodyWidth = null
      this.store = null
      this.scrollY  = true // 暂时默认有纵向滚动条
      this.scrollX = false // 暂时默认无横向滚动条
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
      } else if (typeof value === 'string') {
        el.style['height'] = ''
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
    // 动态计算宽度
    updateColumnsWidth () {
      const fit = this.fit
      const bodyWidth = this.table.$el.clientWidth
      const flattenColumns = this.getFlattenColumns();
      let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number');
      let bodyMinWidth = 0

      flattenColumns.forEach((column) => { // Clean those columns whose width changed from flex to unflex
        if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
      })
      if (flexColumns.length > 0 && fit) {
        flattenColumns.forEach((column) => {
          bodyMinWidth += column.width || column.minWidth || 80;
        });
        
        const scrollYWidth = this.scrollY ? 8 : 0;
        if (bodyMinWidth <= bodyWidth - scrollYWidth) { // DON'T HAVE SCROLL BAR
          this.scrollX = false; // 无横向滚动条
                                
          const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth;
  
          if (flexColumns.length === 1) {
            flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth;
          } else {
            const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0);

            const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
            
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
    }
  }
  export default TableLayout