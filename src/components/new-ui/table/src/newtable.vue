<template>
  <div class="tableStyle" cellspacing="0" cellpadding="0" ref="table">
    <!-- 表格头部 -->
    <div class="tableHeader" ref="headerWrapper">
      <table-header :style="{width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''}"></table-header>
    </div>
    <!-- 父组件传过来的table-column的插槽 -->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>

    <div class="tableBody" ref="bodyWrapper">
      <table-body :store="store"  :style="{ width: bodyWidth }"></table-body>
      <!-- 空数据 -->
      <div v-if="!data || data.length === 0" class="el-table__empty-block" ref="emptyBlock">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import "./tableHeader.css";
import "./tableBody.css";
import TableStore from "./tableStore";
import TableLayout from "./tableLayout";
import tableHeader from "./tableHeader";
import TableBody from './tableBody'

import { addResizeListener, removeResizeListener } from "./utils/resize-event";
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
    },
    fit: {
      type: Boolean,
      default: true
    },
    height: [String, Number]
  },
  computed: {
    shouldUpdateHeight() {
      return (
        this.height ||
        this.maxHeight ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0
      );
    },
    columns() {
      return this.store.states.columns;
    },
     bodyWidth () {
      const { bodyWidth, scrollY, gutterWidth } = this.layout
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
    }
  },
  components: {
    tableHeader,
    TableBody
  },
  methods: {
    doLayout() {
      this.layout.updateColumnsWidth();
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight();
      }
    },
    bindEvents() {
      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener); // 事件最后执行
      }
    },
    // 添加元素监听事件
    resizeListener() {
      if (!this.$ready) return;
      let shouldUpdateLayout = false;
      const el = this.$el;
      const { width: oldWidth, height: oldHeight } = this.resizeState;

      const width = el.offsetWidth;

      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }

      const height = el.offsetHeight;
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width;
        this.resizeState.height = height;
        this.doLayout();
      }
    }
  },
  mounted() {
    this.bindEvents(); // 绑定事件
    this.doLayout();

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };
    this.$ready = true;
  }
};
</script>