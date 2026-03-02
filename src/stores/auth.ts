// src/stores/auth.ts
import { defineStore } from 'pinia';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as null | User }),
  actions: {
    async login(email: string, password: string) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      this.user = cred.user;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});