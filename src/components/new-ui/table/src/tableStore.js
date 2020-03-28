

const TableStore = function (table) {
    if (!table) { // 等待组件初始化
        throw new Error('Table is required')
    }
    this.states = {
        data: null, // 开始渲染数据
        columns: []
    }
}


// 状态管理 统一存储数据
TableStore.prototype.mutations = {
    setData(states, data) {
        states.data = data
    }
}

// commit 方法封装
TableStore.prototype.commit = function (name, ...args) {
    const mutations = this.mutations;
    if (mutations[name]) {
        mutations[name].apply(this, [this.states].concat(args)); // apply参数是数组
    } else {
        throw new Error(`Action not found: ${name}`);
    }
}

export default TableStore