import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './reuqest'
Vue.use(Vant);
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h:any) => h(App)
}).$mount('#app')
