import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      next()
      NProgress.done()
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // const hasRoles = store.getters.addRoutes && store.getters.addRoutes.length > 0
      // if (hasRoles) {
      //   next()
      // } else {
      //   try {
      //     // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
      //     // const { roles } = await store.dispatch('user/getInfo')

      //     // generate accessible routes map based on roles
      //     const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

      //     router.addRoutes(accessRoutes)

      //     next({ ...to, replace: true })
      //   } catch (error) {
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || '出错了')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
