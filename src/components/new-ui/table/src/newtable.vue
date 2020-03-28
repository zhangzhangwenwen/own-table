<template>
  <div class="tableStyle" cellspacing="0" cellpadding="0" ref="table">
    <!-- 表格头部 -->
    <div class="tableHeader" ref="headerWrapper">
      <table-header></table-header>
    </div>
    <!-- 父组件传过来的table-column的插槽 -->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import "./tableHeader.css";
import TableStore from "./tableStore";
import TableLayout from "./tableLayout";
import tableHeader from "./tableHeader";

// 平滑数组中的children项
const flattenData = function(data) {
  if (!data) return data;
  let newData = [];
  const flatten = arr => {
    arr.forEach(item => {
      newData.push(item);
      if (Array.isArray(item.children)) {
        flatten(item.children);
      }
    });
  };
  flatten(data);
  if (data.length === newData.length) {
    return data;
  } else {
    return newData;
  }
};

export default {
  data() {
    // 创建状态管理存储数据
    const store = new TableStore(this); // 传入当前this
    const layout = new TableLayout({ table: this, store });
    return {
      store,
      layout,
      resizeState: {
        width: null,
        height: null
      }
    };
  },
  watch: {
    data: {
      handler(value) {
        value = flattenData(value);
        this.store.commit("setData", value); // 利用状态管理设置数据
      },
      immediate: true
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    tableHeader
  },
  methods: {
    doLayout() {
       this.layout.updateColumnsWidth()
    }
  },
  mounted () {
    this.doLayout();
    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }
  }
};
</script>