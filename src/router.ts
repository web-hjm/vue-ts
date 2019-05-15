import Vue from 'vue'
import Router from 'vue-router'
import util from '@/util'
import {$post} from '@/reuqest'
import qs from 'qs'
Vue.use(Router)
export const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  // base: process.env.BASE_URL / process.env.NODE_ENV === "production",
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/login.vue')
    },
    {
      path: '/user-info',
      name: 'userInfo',
      component: () => import(/* webpackChunkName: "userInfo" */ './views/userInfo.vue')
    },
    {
      path: '/recipe/:type',
      name: 'recipe',
      meta: {       
        jurisdiction: true,
        keepAlive: true // 是否缓存组件
      },
      component: () => import(/* webpackChunkName: "recipe" */ './views/recipe.vue')
    },
    {
      path: '/recipe-detail',
      name: 'recipe-detail',
      component: () => import(/* webpackChunkName: "recipe-detatil" */ './views/recipe-detail.vue')
    },
    {
      path: '/progress-audit',
      name: 'progress-audit',
      component: () => import(/* webpackChunkName: "recipe-detatil" */ './views/progress-audit.vue')
    },
    {
      path: '/drug-search',
      name: 'drug-search',
      meta: {       
        jurisdiction: true,
        keepAlive: true // 是否缓存组件
      },
      component: () => import(/* webpackChunkName: "recipe-detatil" */ './views/drug-search.vue')
    },
    {
      path: '/drug-detail',
      name: 'drug-detail',
      component: () => import(/* webpackChunkName: "recipe-detatil" */ './views/drug-detail.vue')
    },
    {
      path: '/403',
      meta: {       
        jurisdiction: true
      },
      name: '403',
      component: () => import(/* webpackChunkName: "recipe-detatil" */ './views/403.vue')
    }
  ]
})

router.beforeEach((to:any, from:any, next:any):any => {
  if (!(window.localStorage.getItem('token') && window.localStorage.getItem('openId'))) {
    if (to.path === '/login'){
      next();
    } else {
      next({path: '/login'})
    }
  } else {
    if (to.meta.jurisdiction) {
      to.path == '/403' && next();
      if (to.path != '/403' && to.path !== '/login') {
        $post('/applet/wechatGzh/checkUserAuthUrl', {
          url:process.env.NODE_ENV == 'dev' ? to.path : util.getUrlParams().type
        }, {
          headers: {
            "Content-Type" : 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          transformRequest:  [function (data:any) {
            data = qs.stringify(data)
            return data;
          }],
        }).then((res:any):any => {
          // debugger
          if (!res.data.data) {
            next({path: '/403'})
          }
        })
      }
    } // 权限判断
    // next();
    // !to.meta.jurisdiction && next();
    (to.path === util.getUrlParams().type) && to.meta.jurisdiction ? next(): (to.meta.jurisdiction || to.path == '/') ? next({path:util.getUrlParams().type}) : next();
  }
})