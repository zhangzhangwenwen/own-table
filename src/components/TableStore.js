import Vue from 'vue'
import debounce from './utils/debounce';
const toggleRowSelection = function(states, row, selected) {
  let changed = false
  const selection = states.selection
  const index = selection.indexOf(row)
  if (typeof selected === 'undefined') {
    if (index === -1) {
      selection.push(row)
      changed = true
    } else {
      selection.splice(index, 1)
      changed = true
    }
  } else {
    if (selected && index === -1) {
      selection.push(row)
      changed = true
    } else if (!selected && index > -1) {
      selection.splice(index, 1);
      changed = true
    }
  }
  return changed
}

const TableStore = function (table, initialState) {
  if (!table) {
    throw new Error('Table is required')
  }
  this.table = table
  this.states = {
    columns: [],
    data: null,
    selection: [],
    selectable: true,
    isAllSelected: false // 表格中设定了type=selection的时候表头是否选择
  }
  // 点击事件
  this._toggleAllSelection = debounce(10, function(states) {
    const data = states.data || []
    if (data.length === 0) return
    const selection = this.states.selection
    // when only some rows are selected (but not all), select or deselect all of them
    // depending on the value of selectOnIndeterminate
    const value = !states.isAllSelected // 如果点击表头的时候isAllSelected为true 就取消所有选择
    let selectionChanged = false
    data.forEach((item, index) => {
      if (states.selectable) {
        if (toggleRowSelection(states, item, value)) {
          selectionChanged = true
        }
      }
    });
    const table = this.table
    if (selectionChanged) {
      table.$emit('selection-change', selection ? selection.slice() : [])
    }
    table.$emit('select-all', selection)
    states.isAllSelected = value
  })
}
TableStore.prototype.updateAllSelected = function () {
   const states = this.states;
   const { selection, rowKey, selectable, data } = states;
   if (!data || data.length === 0) {
     states.isAllSelected = false
     return
   }
   if (selection.length === data.length) {
     states.isAllSelected = true
   } else {
    states.isAllSelected = false
   }
}

TableStore.prototype.mutations = {
  // 表格主体的checkedBox的点击事件
  rowSelectedChanged(states, row) {
    const changed = toggleRowSelection(states, row)
    const selection = states.selection
    if (changed) {
      const table = this.table;
      table.$emit('selection-change', selection ? selection.slice() : []);
      table.$emit('select', selection, row);
    }

    this.updateAllSelected()
  },
  toggleAllSelection(state) {
    this._toggleAllSelection(state)
  },
  setData(states, data) {
    // Object.keys(states.filters).forEach((columnId) => {
    //   const values = states.filters[columnId];
    //   if (!values || values.length === 0) return;
    //   const column = getColumnById(this.states, columnId);
    //   if (column && column.filterMethod) {
    //     data = data.filter((row) => {
    //       return values.some(value => column.filterMethod.call(null, value, row, column));
    //     });
    //   }
    // });

    // states.filteredData = data;
    states.data = data
    // this.updateCurrentRow();

    // const rowKey = states.rowKey;

    // if (!states.reserveSelection) {
    //   if (dataInstanceChanged) {
    //     this.clearSelection();
    //   } else {
    //     this.cleanSelection();
    //   }
    //   this.updateAllSelected();
    // } else {
    //   if (rowKey) {
    //     const selection = states.selection;
    //     const selectedMap = getKeysMap(selection, rowKey);

    //     states.data.forEach((row) => {
    //       const rowId = getRowIdentity(row, rowKey);
    //       const rowInfo = selectedMap[rowId];
    //       if (rowInfo) {
    //         selection[rowInfo.index] = row;
    //       }
    //     });

    //     this.updateAllSelected();
    //   } else {
    //     console.warn('WARN: rowKey is required when reserve-selection is enabled.');
    //   }
    // }

    // const defaultExpandAll = states.defaultExpandAll;
    // if (defaultExpandAll) {
    //   this.states.expandRows = (states.data || []).slice(0);
    // } else if (rowKey) {
    //   // update expandRows to new rows according to rowKey
    //   const ids = getKeysMap(this.states.expandRows, rowKey);
    //   let expandRows = [];
    //   for (const row of states.data) {
    //     const rowId = getRowIdentity(row, rowKey);
    //     if (ids[rowId]) {
    //       expandRows.push(row);
    //     }
    //   }
    //   this.states.expandRows = expandRows;
    // } else {
    //   // clear the old rows
    //   this.states.expandRows = [];
    // }

    Vue.nextTick(() => this.table.layout.updateScrollY())
  },
  handleRowClick (row) {
    this.table.$emit('row-click', row)
  },
  handleHoverEvent (row) {
    this.table.$emit('row-hover', row)
  },
  init () {
    var rows = this.table.$refs.table.children[1].children
    for (let i = 0; i < rows.length; i++) {
      rows[i].onmouseover = () => {
        rows[i].style.background = 'rgba(255, 99, 132, 0.2)'
      }
      rows[i].onmouseout = () => {
        rows[i].style.background = 'white'
      }
    }
  }
}
TableStore.prototype.commit = function (name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
}
TableStore.prototype.isSelected = function(row) {
  return (this.states.selection || []).indexOf(row) > -1
}
export default TableStore
