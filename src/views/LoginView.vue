<template>
  <div class="login-page">
    <h1>Please sign in to continue</h1>
    <GoogleLoginButton />
  </div>
</template>

<script setup lang="ts">
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
// redirect if already signed in or once login completes
onAuthStateChanged(auth, (user) => {
  if (user) {
    router.replace({ name: 'home' })
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>