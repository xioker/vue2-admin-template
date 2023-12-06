import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  // 菜单管理
  {
    path: '/auth',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'Auth',
    meta: {
      title: '权限管理',
      icon: 'el-icon-menu',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/auth/menu/index'),
        name: 'Menu',
        meta: {
          title: '菜单控制',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role',
        component: () => import('@/views/auth/role/index'),
        name: 'Role',
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'userList',
        component: () => import('@/views/auth/user/index'),
        name: 'UserList',
        meta: {
          title: '管理员'
        }
      },
    ]
  },
  componentsRouter,
  
  // 设置管理
  {
    path: '/setting',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'Setting',
    meta: {
      title: '设置管理',
      icon: 'el-icon-setting',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'theme',
        component: () => import('@/views/setting/theme/index'),
        name: 'Theme',
        meta: {
          title: '主题设置',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'banner',
        component: () => import('@/views/setting/banner/index'),
        name: 'Banner',
        meta: {
          title: '首页banner'
          // if do not set roles, means: this page does not require permission
        }
      },
    ]
  },
  
  // 小说管理
  {
    path: '/novel',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Novel',
    meta: {
      title: '小说管理',
      icon: 'el-icon-reading'
    },
    children: [
      {
        path: 'novelList',
        component: () => import('@/views/novel/novelList/index'),
        name: 'NovelList',
        meta: { title: '小说列表', noCache: true }
      },
      {
        path: 'novelCategory',
        component: () => import('@/views/novel/novelCategory/index'),
        name: 'NovelCategory',
        meta: { title: '小说分类', noCache: true }
      },
      {
        path: 'novelAction',
        component: () => import('@/views/novel/novelAction/index'),
        name: 'NovelAction',
        meta: { title: '小说活动标签', noCache: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


export const asyncRoutes = [
  
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
