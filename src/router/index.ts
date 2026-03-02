import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

// wait for Firebase auth to initialize before allowing navigation
let authReady = false
const initialAuth = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, () => {
    authReady = true
    resolve()
  })
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})


// global guard: ensure auth ready and redirect as necessary
router.beforeEach(async (to, from, next) => {
  if (!authReady) {
    await initialAuth
  }

  const publicPages = ['/login', '/about'];
  const authRequired = !publicPages.includes(to.path);
  const currentUser = auth.currentUser;

  if (authRequired && !currentUser) {
    // not logged in and trying to access protected page
    return next({ name: 'login' });
  }
  if (to.name === 'login' && currentUser) {
    // logged in user should not see login page
    return next({ name: 'home' });
  }

  next();
});

export default router
