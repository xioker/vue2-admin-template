/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'el-icon-user'
  },
  children: [
    {
      path: 'member',
      component: () => import('@/views/user/member/index'),
      name: 'Member',
      meta: { title: '会员列表' }
    },
    {
      path: 'memberLevel',
      component: () => import('@/views/user/memberLevel/index'),
      name: 'MemberLevel',
      meta: { title: '会员等级' }
    },
    {
      path: 'userFreeback',
      component: () => import('@/views/user/userFreeback/index'),
      name: 'UserFreeback',
      meta: { title: '用户反馈' }
    },
    {
      path: 'messages',
      component: () => import('@/views/user/messages/index'),
      name: 'Messages',
      meta: { title: '站内信息' }
    },
    {
      path: 'actionMessages',
      component: () => import('@/views/user/actionMessages/index'),
      name: 'ActionMessages',
      meta: { title: '活动消息' }
    },
    {
      path: 'memberMoney',
      component: () => import('@/views/user/memberMoney/index'),
      name: 'MemberMoney',
      meta: { title: '会员费管理' }
    }
    // {
    //   path: 'sticky',
    //   component: () => import('@/views/components-demo/sticky'),
    //   name: 'StickyDemo',
    //   meta: { title: 'Sticky' }
    // },
    // {
    //   path: 'count-to',
    //   component: () => import('@/views/components-demo/count-to'),
    //   name: 'CountToDemo',
    //   meta: { title: 'Count To' }
    // },
    // {
    //   path: 'mixin',
    //   component: () => import('@/views/components-demo/mixin'),
    //   name: 'ComponentMixinDemo',
    //   meta: { title: 'Component Mixin' }
    // },
    // {
    //   path: 'back-to-top',
    //   component: () => import('@/views/components-demo/back-to-top'),
    //   name: 'BackToTopDemo',
    //   meta: { title: 'Back To Top' }
    // },
    // {
    //   path: 'drag-dialog',
    //   component: () => import('@/views/components-demo/drag-dialog'),
    //   name: 'DragDialogDemo',
    //   meta: { title: 'Drag Dialog' }
    // },
    // {
    //   path: 'drag-select',
    //   component: () => import('@/views/components-demo/drag-select'),
    //   name: 'DragSelectDemo',
    //   meta: { title: 'Drag Select' }
    // },
    // {
    //   path: 'dnd-list',
    //   component: () => import('@/views/components-demo/dnd-list'),
    //   name: 'DndListDemo',
    //   meta: { title: 'Dnd List' }
    // },
    // {
    //   path: 'drag-kanban',
    //   component: () => import('@/views/components-demo/drag-kanban'),
    //   name: 'DragKanbanDemo',
    //   meta: { title: 'Drag Kanban' }
    // }
  ]
}

export default componentsRouter
