<template>
  <div class="tableStyle" cellspacing="0" cellpadding="0" ref="table">
  <div class='tableStyle tableHeader'>
     <table-header
     :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"></table-header>
  </div>
  <slot></slot>
  <div class="tableBody">
      <table-body
      :style="{
           width: bodyWidth
        }"></table-body>
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
import { addResizeListener, removeResizeListener } from './utils/resize-event';
export default {
  name: 'OwnTable',
  props: {
    dataSource: {
      required: true
    },
    emptyText: {
      default: '没有数据'
    },
    fit: {
      type: Boolean,
      default: true
    },
    height: [String, Number]
  },
  watch: {
    dataSource (oldVal, val) {
      this.dataSource = val
    }
  },
  components: {
    TableColumn,
    TableHeader,
    TableBody
  },
  computed: {
    bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout
        return bodyWidth ? bodyWidth - 8 + 'px' : ''
      }
  },
  mounted () {
     // 滚动条滚动事件
   const bodyScroll = document.querySelector('.tableBody')
   const headerScroll = document.querySelector('.tableHeader')
   bodyScroll.addEventListener('scroll', function () {
     headerScroll.scrollLeft = bodyScroll.scrollLeft
   })
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
      }
    }
  },
  methods: {
    bindEvents () {
      if (this.fit) {
         addResizeListener(this.$el, this.resizeListener);
      }
    },
    resizeListener () {
       if (!this.$ready) return;
        let shouldUpdateLayout = false;
        const el = this.$el;
        // 整体table表格的宽高
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
    },
    doLayout () {
       this.layout.setHeight(this.height)
       this.layout.updateColumnsWidth();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .tableStyle {
   overflow-y: auto;
   font-size: 14px;
   margin: 0;
   padding: 0
 }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: none;
  }
  /*!*滚动条的轨道 内阴影+圆角*!*/
  ::-webkit-scrollbar-track-piece {
    background: none;
  }
  /*!*滚动条里面的滑块 内阴影+圆角*!*/
  ::-webkit-scrollbar-thumb {
    background-color: #8492A6;
    border-radius: 1px;
  }
</style>
