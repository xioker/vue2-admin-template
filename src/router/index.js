import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'

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

// 静态路由
export const constantRoutes = [
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 首页
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
  // 404
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  
  // 权限管理
  // {
  //   path: '/auth',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true, 
  //   name: 'Auth',
  //   meta: {
  //     title: '权限管理',
  //     icon: 'el-icon-menu',
  //     roles: ['admin', 'editor'] 
  //   },
  //   children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/auth/menu/index'),
  //       name: 'Menu',
  //       meta: {
  //         title: '菜单控制',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/auth/role/index'),
  //       name: 'Role',
  //       meta: {
  //         title: '角色管理'
  //       }
  //     },
  //     {
  //       path: 'account',
  //       component: () => import('@/views/auth/account/index'),
  //       name: 'Account',
  //       meta: {
  //         title: '管理员'
  //       }
  //     },
  //   ]
  // },
  // // 用户管理
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'User',
  //   meta: {
  //     title: '用户管理',
  //     icon: 'el-icon-user'
  //   },
  //   children: [
  //     {
  //       path: 'member',
  //       component: () => import('@/views/user/member/index'),
  //       name: 'Member',
  //       meta: { title: '会员列表' }
  //     },
  //     {
  //       path: 'memberLevel',
  //       component: () => import('@/views/user/memberLevel/index'),
  //       name: 'MemberLevel',
  //       meta: { title: '会员等级' }
  //     },
  //     {
  //       path: 'userFreeback',
  //       component: () => import('@/views/user/userFreeback/index'),
  //       name: 'UserFreeback',
  //       meta: { title: '用户反馈' }
  //     },
  //     {
  //       path: 'messages',
  //       component: () => import('@/views/user/messages/index'),
  //       name: 'Messages',
  //       meta: { title: '站内信息' }
  //     },
  //     {
  //       path: 'actionMessages',
  //       component: () => import('@/views/user/actionMessages/index'),
  //       name: 'ActionMessages',
  //       meta: { title: '活动消息' }
  //     },
  //     {
  //       path: 'memberMoney',
  //       component: () => import('@/views/user/memberMoney/index'),
  //       name: 'MemberMoney',
  //       meta: { title: '会员费管理' }
  //     }
  //   ]
  // },
  // // 小说管理
  // {
  //   path: '/novel',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Novel',
  //   meta: {
  //     title: '小说管理',
  //     icon: 'el-icon-reading'
  //   },
  //   children: [
  //     {
  //       path: 'novelList',
  //       component: () => import('@/views/novel/novelList/index'),
  //       name: 'NovelList',
  //       meta: { title: '小说列表', noCache: true }
  //     },
  //     {
  //       path: 'novelCategory',
  //       component: () => import('@/views/novel/novelCategory/index'),
  //       name: 'NovelCategory',
  //       meta: { title: '小说分类', noCache: true }
  //     },
  //     {
  //       path: 'novelAction',
  //       component: () => import('@/views/novel/novelAction/index'),
  //       name: 'NovelAction',
  //       meta: { title: '小说活动标签', noCache: true }
  //     },
  //     {
  //       path: 'order',
  //       component: () => import('@/views/novel/order/index'),
  //       name: 'Order',
  //       meta: { title: '订单列表', noCache: true }
  //     }
  //   ]
  // },
  // // 设置管理
  // {
  //   path: '/setting',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Setting',
  //   meta: {
  //     title: '设置管理',
  //     icon: 'el-icon-setting',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'theme',
  //       component: () => import('@/views/setting/theme/index'),
  //       name: 'Theme',
  //       meta: {
  //         title: '主题设置',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'banner',
  //       component: () => import('@/views/setting/banner/index'),
  //       name: 'Banner',
  //       meta: {
  //         title: '首页banner'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //   ]
  // },
  // // 系统设置
  // {
  //   path: '/systemSetting',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'SystemSetting',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'el-icon-s-tools',
  //   },
  //   children: [
  //     {
  //       path: 'sysSetting',
  //       component: () => import('@/views/systemSetting/index'),
  //       name: 'SysSetting',
  //       meta: {
  //         title: '系统设置',
  //       }
  //     },
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
]


// 动态路由
export const asyncRoutes = []

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
