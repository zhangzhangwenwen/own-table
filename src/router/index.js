import Vue from 'vue'
import Router from 'vue-router'
import use from '@/components/use'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'use',
      component: use
    }
  ]
})
