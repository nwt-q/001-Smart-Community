// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import ElementPlus from 'element-plus'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import FreshImage from './components/FreshImage.vue'
import HomeStar from './components/HomeStar.vue'
import NavBarTitleAfter from './components/NavBarTitleAfter.vue'

import './custom.css'
import 'element-plus/dist/index.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-info-after': () => h(HomeStar),
      'nav-bar-title-after': () => h(NavBarTitleAfter),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('FreshImage', FreshImage)
    // @ts-expect-error 忽略掉类型报错
    app.use(ElementPlus)
  },
} satisfies Theme
