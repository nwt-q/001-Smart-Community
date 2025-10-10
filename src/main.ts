import { VueQueryPlugin } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
import GlobalKuRoot from './App.ku.vue'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(VueQueryPlugin)

  // TODO: 经过沟通，此处的手动注册组件属于临时方案 对应的依赖升级并发版后 就可以手动移除了
  app.component('global-ku-root', GlobalKuRoot)

  return {
    app,
  }
}
