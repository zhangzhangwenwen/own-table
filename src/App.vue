<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Appp'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
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
