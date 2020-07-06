import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'


Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [

  {path: '/login',name: 'Login',component: Login},
  //重定向到根组件
  {path:'/',redirect:'/login'},
  {path:'/home',
  component: Home,
  redirect:'/welcome',
  children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users}
    ]
  }
  
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to将要访问的路径
  //from代表从哪个页面访问的
  //next 是一个函数，表示放行，即送到to的地址
  if (to.path === "/login") return next();

  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  //如果token为空，则送到登录界面
  if(!tokenStr) return next('/login');
  //若不为空，则送到to
  next()
})

export default router
