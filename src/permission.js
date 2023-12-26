import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' 
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] 

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() 
    } else {
      const hasRoles = store.getters.addRoutes && store.getters.addRoutes.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || '出错了')
          next(`/login?redirect=${to.path}`)
          store.dispatch('permission/resetRouter')
          NProgress.done()
        }
      }
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
