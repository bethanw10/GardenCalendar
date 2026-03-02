<template>
  <Button
    v-if="!user"
    label="Sign in with Google"
    icon="pi pi-google"
    @click="login"
  ></Button>
  <!-- when logged in the sign-out action will live in the options menu -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { auth, signInWithGoogle, signOutUser } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref(auth.currentUser)

onAuthStateChanged(auth, (u) => {
  user.value = u
})

async function login() {
  try {
    const result = await signInWithGoogle()
    console.log('Google sign-in successful', result.user)
  } catch (e) {
    console.error('Google sign-in failed', e)
    alert('Google sign-in failed')
  }
}

</script>

<style scoped>
</style>
