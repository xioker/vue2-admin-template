import { asyncRoutes, constantRoutes } from '@/router'
import { userDetail, findUserMenu } from '@/api/auth'
import store from '@/store'
import { buildTree, capitalize } from '@/utils'
import Layout from '@/layout'

// 处理菜单路由数据
function handleCom(path){
  if(path.includes('/')){
    // return () => import(`@/views${path}/index.vue`)
    return (r) => require([`@/views${path}/index.vue`], r)
    // return require(`@/views${path}/index.vue`).default
  }
  // return () => import(`@/views/${path}/index.vue`)
  return (r) => require([`@/views/${path}/index.vue`], r)
  // return require(`@/views/${path}/index.vue`).default
}

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles = []) {
  const res = []

  routes.forEach(route => {
    const { component, path, perms, menuName: title, icon, children } = route
    let tmpRoute = { 
      path,
      name: path.includes('/') ? capitalize(path.replace('/', '')) : capitalize(path),
      component,
      children,
      meta: { title, icon, roles: perms || [] }
    }
    
    // 构造路由结构数据
    if (tmpRoute.component?.toString() === "Layout") {
      tmpRoute.component = Layout;
      tmpRoute.redirect = 'noRedirect'
      if(tmpRoute.children.length>0){
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children)
      }
    }else{
      tmpRoute.component = handleCom(tmpRoute.component)
    }
    res.push(tmpRoute);
  })
  return res
}

const state = {
  // 设置默认路由
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes = []) => {
    routes.length > 0 && routes.push({ path: "/:catchAll(.*)",redirect: '/404', hidden: true  })
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles = []) {
    return new Promise( async (resolve) => {
      let accessedRoutes
      const res = await findUserMenu({userId: store.getters.userInfo ? store.getters.userInfo.userId : ''})
      accessedRoutes = filterAsyncRoutes(res ? buildTree(res) : [])
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // 清除路由
  resetRouter({ commit }){
    commit('SET_ROUTES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
