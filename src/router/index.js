import Vue from 'vue'
import Router from 'vue-router'
import Treemap from '../pages/treemap.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Treemap',
      component:Treemap
    }
  ]
})
