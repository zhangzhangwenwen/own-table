<template>
  <div class="tableStyle" cellspacing="0" cellpadding="0" ref="table">

    <!-- 表格头部 -->
    <div class="tableHeader" ref="headerWrapper">
      <table-header :style="{width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''}">
      </table-header>
    </div>
    <!-- 父组件传过来的table-column的插槽 -->
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>


    <!-- 表格主体 -->
    <div  class="tableBody" ref="bodyWrapper" :style="[bodyHeight]">
      <table-body 
        :style="{ width: bodyWidth }"
        :store="store"
        :row-class-name="rowClassName"
      >
      </table-body>
      <!-- 空数据 -->
      <div v-if="!dataSource || dataSource.length === 0"
        class="el-table__empty-block"
        ref="emptyBlock"
        :style="{
          width: bodyWidth
        }">
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import './TableHeader.css'
import './TableBody.css'
import TableStore from './TableStore'
import TableLayout from './TableLayout'
import TableHeader from './TableHeader'
import TableColumn from './TableColumn'
import TableBody from './TableBody'
import { addResizeListener, removeResizeListener } from './utils/resize-event'

const flattenData = function(data) {
  if (!data) return data;
  let newData = [];
  const flatten = arr => {
    arr.forEach((item) => {
      newData.push(item);
      if (Array.isArray(item.children)) {
        flatten(item.children)
      }
    });
  };
  flatten(data);
  if (data.length === newData.length) {
    return data
  } else {
    return newData
  }
}

export default {
  name: 'OwnTable',
  props: {
    rowClassName: [String, Function],
    dataSource: {
      type: Array,
      default: function() {
        return [];
      }
    },
    emptyText: {
      default: '没有数据'
    },
    fit: {
      type: Boolean,
      default: true
    },
    height: [String, Number],
    maxHeight: [String, Number]
  },
  watch: {
    dataSource: {
      immediate: true,
      handler(value) {
        value = flattenData(value)
        this.store.commit('setData', value)
        if (this.$ready) {
        this.$nextTick(() => {
          this.doLayout()
        })
       }
      }
    },
    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value);
      }
    },
    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value);
      }
    }
  },
  components: {
    TableColumn,
    TableHeader,
    TableBody
  },
  computed: {
    // 表格主体的高度
    bodyHeight() {
        if (this.height) {
          return {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          }
        } else if (this.maxHeight) {
           return {
            'max-height': (this.maxHeight - this.layout.headerHeight) + 'px'
          }
        }
        return {}
    },
    bodyWrapper() {
      return this.$refs.bodyWrapper // 表格主体
    },
    bodyWidth () {
      const { bodyWidth, scrollY, gutterWidth } = this.layout
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
    },
    shouldUpdateHeight() {
      return this.height || this.maxHeight
    }
  },
  mounted () {
    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }
    this.doLayout()
    this.bindEvents()

    this.$ready = true
  },
  data () {
    const store = new TableStore(this)
    const layout = new TableLayout({table: this, store: store})
    return {
      store,
      layout,
      resizeState: {
        width: null,
        height: null
      },
       scrollPosition: 'left' // 滚动条所处位置
    }
  },
  methods: {
    bindEvents () {
      // 表头随着表的主体滚动
      const { headerWrapper } = this.$refs
      const refs = this.$refs
      let self = this
      this.bodyWrapper.addEventListener('scroll', function() {
        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft // this.scrollLeft即bodyWrapper的scrollleft距离
        const maxScrollLeftPosition = this.scrollWidth - this.offsetWidth - 1 // this.scrollWidth 滚动区域宽度 this.offsetWidth整个div的宽度 计算出可滚动的最大范围
        const scrollLeft = this.scrollLeft
        if (scrollLeft >= maxScrollLeftPosition) {
          self.scrollPosition = 'right'
        } else if (scrollLeft === 0) {
          self.scrollPosition = 'left'
        } else {
          self.scrollPosition = 'middle'
        }
      })

      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener)
      }
    },
    resizeListener () {
      if (!this.$ready) return
      let shouldUpdateLayout = false
      const el = this.$el
      // 整体table表格的宽高
      const { width: oldWidth, height: oldHeight } = this.resizeState
      const width = el.offsetWidth
      if (oldWidth !== width) {
        shouldUpdateLayout = true
      }

      const height = el.offsetHeight
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width
        this.resizeState.height = height
        this.doLayout()
      }
    },
    doLayout () {
      this.layout.setHeight(this.height)
      this.layout.updateColumnsWidth()
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .tableStyle {
   font-size: 14px;
 }
 .el-table__empty-text {
    width: 50%;
    color: #909399;
}
 .el-table__empty-block {
    min-height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
 }
</style>
