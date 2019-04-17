import Vue from 'vue'
const TableStore = function (table, initialState) {
  if (!table) {
    throw new Error('Table is required')
  }
  this.table = table
  this.states = {
    columns: [],
    data: null
  }
}
TableStore.prototype.mutations = {
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
export default TableStore
