import { asyncRoutes, constantRoutes } from '@/router'
import { userDetail, findUserMenu } from '@/api/auth'
import store from '@/store'
import { buildTree, capitalize } from '@/utils'
import Layout from '@/layout'


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
    const { component, path, perms, menuName, icon, children } = route
    let tmpRoute = { 
      component,
      path,
      children,
      name: path.includes('/') ? capitalize(path.replace('/', '')) : capitalize(path),
      meta: { title: menuName, icon: icon, roles: perms || [] }
    }
    
    // 构造路由结构数据
    if (tmpRoute.component?.toString() === "Layout") {
      tmpRoute.component = Layout;
      tmpRoute.redirect = 'noRedirect'
      if(tmpRoute.children&&tmpRoute.children.length>0){
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children)
      }
    }else{
      tmpRoute.component = () => import(`@/views/${tmpRoute.component}/index.vue`);
    }
    res.push(tmpRoute);
  })
  // 404页面放在最后面
  return res.push({ path: '*', redirect: '/404', hidden: true })
}

const state = {
  // 设置默认路由
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    console.log(store.getters)
    return new Promise(resolve => {
      let accessedRoutes
      // findUserMenu({userId: store.getters.userInfo ? store.getters.userInfo.userId : ''}).then((res) => {
      //    let tree = res ? buildTree(res) : []
      //    let x = filterAsyncRoutes(tree)
      //    console.log(tree,x)
      // }).finally(()=>{})
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
